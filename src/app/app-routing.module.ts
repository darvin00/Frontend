import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth.guard';
import { AdminauthGuard } from './admin/services/adminauth.guard';

import { RouterModule, Routes } from '@angular/router';
import { SheshineComponent } from './sheshine/sheshine/sheshine.component';
import { HomeComponent } from './sheshine/home/home.component';
import { ProductsComponent } from './sheshine/products-component/products.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductOrderComponent } from './product-order/product-order.component';
import { ProductCardComponent } from './sheshine/product-card/product-card.component';
import { AddressListComponent } from './address-list/address-list.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { PaymentComponent } from './payment/payment.component';
import { TogglingComponent } from './sheshine/toggling/toggling.component';
import { ProductViewDetailsComponent } from './sheshine/product-view-details/product-view-details.component';
import { Router, NavigationEnd } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ShineComponent } from './shine/shine/shine.component';
import { ShineHomeComponent } from './shine/shine-home/shine-home.component';
import { BodyCareComponent } from './shine/Body-care/Body-care.component';
import { BabyCareComponent } from './shine/Baby-care/Baby-care.component';
import { FaceCareComponent } from './shine/face-care/face-care.component';
import { HairCareComponent } from './shine/Hair-care/Hair-care.component';
import { SkinCareComponent } from './shine/Skin-care/Skin-care.component';
import { NewLaunchesComponent } from './shine/New-Launches/New-Launches.component';
import { ShineproductsComponent } from './shine/shineproducts/shineproducts.component';
import { ShineProductViewComponent } from './shine/shine-product-view/shine-product-view.component';
import { Image360ViewComponent } from './image-360-view/image-360-view.component';
import { AdminLoginComponent } from './admin/admin/admin-login/admin-login.component';
import { DashboardComponent } from './admin/admin/dashboard/dashboard.component';
import { OverviewComponent } from './admin/admin/overview/overview.component';
import { ProductManagementComponent } from './admin/admin/product-management/product-management.component';
import { DiscountsOffersComponent } from './admin/admin/discounts-offers/discounts-offers.component';
import { OrderManagementComponent } from './admin/admin/order-management/order-management.component';
import { CustomerManagementComponent } from './admin/admin/customer-management/customer-management.component';
import { ReportsAnalyticsComponent } from './admin/admin/reports-analytics/reports-analytics.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CustomerBehaviorComponent } from './admin/admin/customer-behavior/customer-behavior.component';
import { OutOfStockProductComponent } from './admin/admin/out-of-stock-product/out-of-stock-product.component';
import { PendingOrderComponent } from './admin/admin/pending-order/pending-order.component';
import { ProductListComponent } from './admin/admin/product-list/product-list.component';
import { ShippingDetailComponent } from './admin/admin/shipping-detail/shipping-detail.component';
import { SummaryCardComponent } from './admin/admin/summary-card/summary-card.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { FavoritproductComponent } from './favoritproduct/favoritproduct.component';
import { AdminApproveReviewComponent } from './admin/admin/admin-approve-review/admin-approve-review.component';
import { FlashOffersComponent } from './flash-offers/flash-offers.component';
import { OfferManagementComponent } from './admin/admin/offer-management/offer-management.component';
import { ShineProductAddComponent } from './admin/admin/shine-product-add/shine-product-add.component';
import { TermsAndConditionComponent } from './company-terms/Terms-and-condition/Terms-and-condition.component';
import { CancellationAndRefundComponent } from './company-terms/Cancellation-and-Refund/Cancellation-and-Refund.component';
import { ShippingAndDeliveryComponent } from './company-terms/Shipping-and-Delivery/Shipping-and-Delivery.component';
import { PrivacyPolicyComponent } from './company-terms/privacy-policy/privacy-policy.component';
import { DeviceGuard } from './admin/services/device.guard';



const routes: Routes = [
  {
    path: 'sheshine', component: SheshineComponent, children:
  [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/sheshine/home', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
     { path: 'products/:category', component: ProductsComponent },

    // { path: 'payment', component: PaymentComponent },


    { path: 'contact', component: ContactComponent },
        { path: 'cart', component: CartComponent },
        {path:'sheshineview',component:ProductViewDetailsComponent},





      ]
  },
  {
    path: 'shine', component: ShineComponent, children: [
      { path: 'shinehome', component: ShineHomeComponent },
      { path: '', redirectTo: '/shine/shinehome', pathMatch: 'full' },
       {path: 'bodycare', component: BodyCareComponent},
     { path: 'babycare', component: BabyCareComponent },
     { path: 'facecare', component: FaceCareComponent },
     { path: 'haircare', component: HairCareComponent },
     { path: 'skincare', component: SkinCareComponent },
     {path: 'shineproducts', component: ShineproductsComponent },
     { path: 'newlaunches', component: NewLaunchesComponent },
     { path: 'shineview', component: ShineProductViewComponent },
     



    ]
  },






  { path: 'admin', component: AdminLoginComponent },

  {path: 'dashboard',component: DashboardComponent,  canActivate: [AdminauthGuard, DeviceGuard],  children: [


  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'product', component: ProductManagementComponent },
  { path: 'discounts', component: DiscountsOffersComponent },
  { path: 'order', component: OrderManagementComponent },
  { path: 'customer', component: CustomerManagementComponent },
    { path: 'report', component: ReportsAnalyticsComponent },
    { path: 'behavior', component: CustomerBehaviorComponent },
    { path: 'outofstock', component: OutOfStockProductComponent },
    { path: 'pendingorder', component: PendingOrderComponent },
    { path: 'productlist', component: ProductListComponent },
    { path: 'shippingdetail', component: ShippingDetailComponent },
    { path: 'summarycard', component: SummaryCardComponent },
     { path: 'adminreview', component: AdminApproveReviewComponent },
     { path: 'shineproductadd', component: ShineProductAddComponent },


  ]
  },




  { path: '', redirectTo: '/shine', pathMatch: 'full' },
   { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent },
  { path: '', component: ProductCardComponent },
  { path: 'address-list/:id', component: AddressListComponent },
  { path: 'address-list', component: AddressListComponent },
   { path: 'product/:id', component: ProductOrderComponent },
  { path: 'add-address/:id', component: AddAddressComponent },
  { path: 'add-address', component: AddAddressComponent },
 { path: 'toggle', component: TogglingComponent, canActivate: [AuthGuard] },
  { path: 'payment/:id', component: PaymentComponent },
  { path: 'payment', component: PaymentComponent },

  { path: 'user', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'image360', component: Image360ViewComponent },
  { path: 'about', component: AboutComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'verify', component: VerifyAccountComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/:id', component: OrderDetailsComponent },
  { path: 'favorit/:id', component: FavoritproductComponent },
  { path: 'favorit', component: FavoritproductComponent },
  { path: 'flashoffers', component: FlashOffersComponent },
  { path: 'offersmanagement', component: OfferManagementComponent },
  { path: 'Termsandcondition', component: TermsAndConditionComponent },
  { path: 'CancellationandRefund', component: CancellationAndRefundComponent },
  { path: 'ShippingandDelivery', component: ShippingAndDeliveryComponent },
  { path: 'privacypolicy', component: PrivacyPolicyComponent },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

