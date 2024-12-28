import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../services/customer';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {

  customerForm: FormGroup;
  selectedFile: File | null = null;
  customers: any[] = [];
  editMode: boolean = false;
  selectedCustomerId: number | null = null;

  // Reference to the file input
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(private fb: FormBuilder, private customerService: CustomerService) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      text: ['', Validators.required],
      customerImg: [null]
    });
  }

  ngOnInit(): void {
    this.loadCustomers(); // Load all customers when component loads
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {

      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Submit customer (either add or update based on editMode)
  submitCustomer(): void {
    const formData = new FormData();
    formData.append('name', this.customerForm.get('name')?.value);
    formData.append('text', this.customerForm.get('text')?.value);

    if (this.selectedFile) {
      formData.append('customerImg', this.selectedFile, this.selectedFile.name);
    }

    if (this.editMode && this.selectedCustomerId) {
      // Update existing customer
      this.customerService.updateCustomer(this.selectedCustomerId, formData).subscribe({
        next: () => {
          this.resetForm();
          this.loadCustomers(); // Refresh the list
        },
        error: (err) => {

        }
      });
    } else {
      // Add new customer
      this.customerService.addCustomer(formData).subscribe({
        next: () => {
          this.resetForm();
          this.loadCustomers(); // Refresh the list
        },
        error: (err) => {

        }
      });
    }
  }

  // Load customer details into the form for editing
  editCustomer(customer: any): void {
    this.editMode = true;
    this.selectedCustomerId = customer.id;

    this.customerForm.patchValue({
      name: customer.name,
      text: customer.text
    });
  }

  // Delete customer
  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers(); // Refresh the list
        },
        error: (err) => {
         
        }
      });
    }
  }

  // Reset form and clear file input
  resetForm(): void {
    this.customerForm.reset();
    this.selectedFile = null;
    this.editMode = false;
    this.selectedCustomerId = null;

    // Clear the file input directly using @ViewChild
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Clear file input
    }
  }
}
