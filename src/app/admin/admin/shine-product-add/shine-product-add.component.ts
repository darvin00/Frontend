import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-shine-product-add',
  templateUrl: './shine-product-add.component.html',
  styleUrls: ['./shine-product-add.component.scss']
})
export class ShineProductAddComponent implements OnInit {

  productForm: FormGroup;
  products: Product[] = [];
  productId: number | null = null; // This will be used only for updating
  mainImage: File | null = null;
  thumbnail: File | null = null;
  threeDImages: File[] = [];
  images: File[] = [];
  cardImages: File[] = [];
  searchQuery: string = '';
  filteredProducts = [...this.products];
  discount: number = 0;
  isSubmitting: boolean = false;
  isSubmitted: boolean = false;
  fillAllFieldsMessage: boolean = false; // Track missing fields

categories: string[] = ['body care', 'face care', 'hair care', 'new launches', 'skin care'];



  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      mrp: [0, Validators.required],
      price: [0, Validators.required],
      stockQuantity: [0, Validators.required],
      discount: [0],
      averageRating: [null, [Validators.min(0), Validators.max(5)]],
      shine: [false],
      sheShine: [false],
      subcategory: [''],
      category: ['', Validators.required],
      benefit: [''],
      suitable: [''],
      keybenefit: [''],
      howToUse: [''],
      ingredients: [''],
      size: [''],
      color: [''],
      specialLine: [''],
      feature: [false],
      trend: [false],
      special: [false],
      cards: this.fb.array([]) // Form array for cards
    });

    // Subscribe to MRP and Price changes to calculate the discount
    this.productForm.get('mrp')?.valueChanges.subscribe(() => this.calculateDiscount());
    this.productForm.get('price')?.valueChanges.subscribe(() => this.calculateDiscount());
  }

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        // Filter the products to show only those with sheshine = true
        this.products = data.filter(product => product.shine === true);
        this.filteredProducts = this.products; // Initialize filteredProducts with the filtered data
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  // Filter products based on the search queryT
  filterProducts() {
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      // Filter based on ID or Name (case-insensitive)
      this.filteredProducts = this.products.filter(product =>
        product.id.toString().includes(query) || product.name?.toLowerCase().includes(query)
      );
    } else {
      // If no search query, display all products
      this.filteredProducts = this.products;
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Calculate discount percentage based on MRP and Price
  calculateDiscount(): void {
    const mrp = this.productForm.get('mrp')?.value || 0;
    const price = this.productForm.get('price')?.value || 0;

    if (mrp > 0 && price > 0) {
      this.discount = ((mrp - price) / mrp) * 100;
      this.productForm.get('discount')?.setValue(this.discount.toFixed(2));
    } else {
      this.discount = 0;
      this.productForm.get('discount')?.setValue(0);
    }
  }

  // Calculate discounted price based on MRP and Discount
  calculatePrice(): void {
    const mrp = this.productForm.get('mrp')?.value || 0;
    const discount = this.productForm.get('discount')?.value || 0;

    let discountedPrice = mrp - (mrp * discount) / 100;
    if (discountedPrice < 0) {
      discountedPrice = 0;
    }
    this.productForm.get('price')?.setValue(discountedPrice.toFixed(2));
  }

  cards(): FormArray {
    return this.productForm.get('cards') as FormArray;
  }

  addCard() {
    const cardForm = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
    });
    this.cards().push(cardForm);
  }

  removeCard(index: number) {
    this.cards().removeAt(index);
  }

  onFileChange(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);

      for (let file of files) {
        if (!file.type.startsWith('image/')) {
          alert('Only image files are allowed.');
          return;
        }
      }

      if (type === 'mainImage') {
        this.mainImage = files[0];
      } else if (type === 'thumbnail') {
        this.thumbnail = files[0];
      } else if (type === 'threeDImages') {
        this.threeDImages = files;
      } else if (type === 'images') {
        this.images = files;
      } else if (type === 'cardImages') {
        this.cardImages = files;
      }
    }
  }

  async onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      this.isSubmitted = true;
      this.fillAllFieldsMessage = false; // Hide the warning message
      const product: Product = this.productForm.value;

      const formData: FormData = new FormData();
      formData.append('mainImage', this.mainImage as Blob);
      formData.append('thumbnail', this.thumbnail as Blob);
      this.threeDImages.forEach(image => formData.append('threeDImages', image));
      this.images.forEach(image => formData.append('images', image));
      this.cardImages.forEach(image => formData.append('cardImages', image));
      formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

      if (this.productId) {
        await this.productService.updateProduct(this.productId, formData);
        this.fetchProducts();
        this.resetForm();
      } else {
        await this.productService.addProduct(formData);
        this.fetchProducts();
        this.resetForm();
        this.isSubmitting = false;
      }
      // Simulate submission process
      setTimeout(() => {
        this.isSubmitting = false;
        
        this.isSubmitted = false;
        this.resetForm();
      }, 2000);
    } else {
      this.fillAllFieldsMessage = true;
      // Show the warning message
      this.isSubmitting = false;
      
    }

  }

  resetForm(): void {
    this.productForm.reset();
    this.productId = null;
  }

  private async loadProduct(id: number) {
    try {
      const product = await this.productService.getProductById(id);
      if (product) {
        this.productForm.patchValue(product);
      }
    } catch (error) {

    }
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.fetchProducts();
      },
      (error) => {

      }
    );
  }

  updateProduct(id: number): void {
    this.productId = id;
    this.loadProduct(id);
  }

}
