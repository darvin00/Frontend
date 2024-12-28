import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../services/order.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
 message: string | null = null;
  error: string | null = null;


  isTermsModalVisible: boolean = false; // To show or hide the modal
  acceptedTerms: boolean = false; // To track if the user accepted terms
  pendingOrderId: number | null = null; // Store order ID temporarily

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder(): void {
    const id = localStorage.getItem('selectedOrderId'); // Retrieve order ID from local storage
    if (id) {
      this.orderService.getOrderById(Number(id)).subscribe(
        (data: Order) => {
          this.order = data;
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    } else {
      console.error('No order ID found in local storage');
    }
  }
  
   // Show the modal to confirm terms before cancelling the order
  confirmCancellation(orderId: number): void {
    this.pendingOrderId = orderId; // Store the order ID
    this.isTermsModalVisible = true; // Show the modal
  }

  // Handle user accepting terms and cancelling the order
  acceptTermsAndCancel(): void {
  if (this.pendingOrderId !== null && this.acceptedTerms) {
    this.orderService.cancelOrderWithRefund(this.pendingOrderId).subscribe({
      next: (response) => {
        this.message = response.message;
        this.error = null;

        // Show the message for 5 seconds, then clear it
        setTimeout(() => {
          this.message = null;
        }, 5000); // 5000 milliseconds = 5 seconds
      },
      error: (err) => {
        this.error = err.message;
        this.message = null;

        // Show the error for 5 seconds, then clear it
        setTimeout(() => {
          this.error = null;
        }, 5000); // 5000 milliseconds = 5 seconds
      }
    });
  }

  // Hide the modal and reset states
  this.isTermsModalVisible = false;
  this.pendingOrderId = null;
  this.acceptedTerms = false;
}


  // Close the modal without canceling
  closeModal(): void {
    this.isTermsModalVisible = false; // Hide the modal
    this.pendingOrderId = null; // Clear the pending order ID
    this.acceptedTerms = false; // Reset the checkbox state
  }


downloadInvoice(order: Order) {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Shop details
    const shopName = "KPM Super Shopee";
    const taxInvoiceTitle = "TAX INVOICE";
    const shopSellerDetails = [
      "GSTIN: 33AAAPL1234A1ZB",
      "Contact: 9876543210",
      "Shop Address: 123 Main Street, City, State, 123456",
      "Email: contact@kpmsupershopee.com"
    ];
    const shopLogo = '../../assets/images/general/kpm-shine-logo.jpg'; // Path to your shop logo

    // Invoice details
    const invoiceNumber = order.invoiceNumber;
    const orderDate = order.orderDate || 'N/A';
    const deliveryDate = order.deliveryDate || 'N/A';

    // Customer details
    const customerName = order.address?.name || 'N/A';
    const customerAddress = `${order.address?.addressLine1 || ''}, ${order.address?.addressLine2 || ''}, ${order.address?.city || ''}, ${order.address?.state || ''}, ${order.address?.zip || ''}`;

    // Load shop logo and generate PDF
    const img = new Image();
    img.src = shopLogo;

    img.onload = () => {
        // Add Shop Logo
        doc.addImage(img, 'PNG', 10, 10, 30, 30);

        // Center the shop name and tax invoice title
        doc.setFontSize(16);
        doc.text(shopName, (doc.internal.pageSize.width - doc.getTextWidth(shopName)) / 2, 20);

        doc.setFontSize(20);
        doc.text(taxInvoiceTitle, (doc.internal.pageSize.width - doc.getTextWidth(taxInvoiceTitle)) / 2, 30);

        // Add Shop Seller Details (right side)
        doc.setFontSize(12);
        const marginRight = 10;
        const sellerDetailsYStart = 40;
        doc.text(shopSellerDetails[0], doc.internal.pageSize.width - doc.getTextWidth(shopSellerDetails[0]) - marginRight, sellerDetailsYStart);
        doc.text(shopSellerDetails[1], doc.internal.pageSize.width - doc.getTextWidth(shopSellerDetails[1]) - marginRight, sellerDetailsYStart + 6);
        doc.text(shopSellerDetails[2], doc.internal.pageSize.width - doc.getTextWidth(shopSellerDetails[2]) - marginRight, sellerDetailsYStart + 12);

        // Add Invoice Number and Dates
        doc.text(`Invoice Number: ${invoiceNumber}`, 10, 60);
        doc.text(`Order Date: ${orderDate}`, doc.internal.pageSize.width - doc.getTextWidth(`Order Date: ${orderDate}`) - marginRight, 60);
        doc.text(`Delivery Date: ${deliveryDate}`, 10, 70);

        // Add Customer Details
        doc.text('Customer Details:', 10, 90);
        doc.setFontSize(10);
        doc.text(`Name: ${customerName}`, 10, 95);
        doc.text(`Address: ${customerAddress}`, 10, 100);

        // Add Product Details Header
        doc.setFontSize(12);
        doc.text('Product Details:', 10, 110);
        doc.text('Item', 10, 120);
        doc.text('Size', 100, 120);  // Size column
        doc.text('Quantity', 150, 120);
        doc.text('Price', 180, 120);

        // Add a horizontal line for the header
        doc.line(10, 122, 200, 122);

        // Loop through order items and display them
        let startY = 130;
        order.orderItems.forEach((item, index) => {
            const productName = item.product?.name || 'Unknown Product';
            const size = item.product?.size || 'N/A';
            const quantity = item.quantity || 0;
            const price = item.product?.price || 0;
            const priceDisplay = `${price.toFixed(2)}`;

            // Wrap text if product name is too long
            const maxProductNameWidth = 90;  // Maximum width for product name column
            const productNameLines = doc.splitTextToSize(`${index + 1}. ${productName}`, maxProductNameWidth);

            // Add product details aligned properly
            productNameLines.forEach((line: string, lineIndex: number) => {
    doc.text(line, 10, startY + lineIndex * 6); // Display name with wrapping
});

            doc.text(size, 100, startY); // Size column
            doc.text(`${quantity}`, 150, startY);
            doc.text(priceDisplay, 180, startY);

            // Update Y position for the next item
            startY += productNameLines.length * 6 + 4;
        });

        // Calculate and display Total Price
        const totalPrice = order.orderItems.reduce((acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0), 0);
        const totalPriceDisplay = `Total Amount: ${totalPrice.toFixed(2)}`;
        const totalWidth = doc.getTextWidth(totalPriceDisplay);
        doc.text(totalPriceDisplay, doc.internal.pageSize.width - totalWidth - 30, startY + 10);

        // Add signature placeholder on the right
const signatureImage = 'assets/images/productimage/p1.jpg';
const signatureImg = new Image();
signatureImg.src = signatureImage;

signatureImg.onload = () => {
    // Add signature image to the PDF
    doc.addImage(signatureImg, 'PNG', doc.internal.pageSize.width - 80, startY + 30, 60, 20);

    // Add text below the signature image
    const signatoryText = 'Authorized Signatory';
    const signatoryTextX = doc.internal.pageSize.width - 80; // X position for the text
    const signatoryTextY = startY + 30 + 20 + 5; // Y position (after image + some padding)

    // Set font for the text (optional, you can change the size and style)
    doc.setFontSize(10);
    doc.text(signatoryText, signatoryTextX, signatoryTextY);

    // Save the document
    doc.save(`Invoice-${order.invoiceNumber}.pdf`);
};
    };

    img.onerror = () => {

    };
}





}
