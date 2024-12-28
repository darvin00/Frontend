import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SheshineComponent } from './sheshine/sheshine/sheshine.component';

import { NavtabComponent } from './sheshine/navtab/navtab.component';
import { HomeComponent } from './sheshine/home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './sheshine/products-component/products.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CartComponent } from './cart/cart.component';
import { ProductOrderComponent } from './product-order/product-order.component';
import { ProductCardComponent } from './sheshine/product-card/product-card.component';
import { AddressListComponent } from './address-list/address-list.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { FormsModule } from '@angular/forms';
import { PaymentComponent } from './payment/payment.component';
import { TogglingComponent } from './sheshine/toggling/toggling.component';
import { ProductViewDetailsComponent } from './sheshine/product-view-details/product-view-details.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FeatureComponent } from './sheshine/feature/feature.component';
import { TrendingComponent } from './sheshine/trending/trending.component';
import { SpecialComponent } from './sheshine/special/special.component';
import { TestmonialComponent } from './sheshine/testmonial/testmonial.component';
import { CustomerComponent } from './sheshine/customer/customer.component';
import { FooterComponent } from './footer/footer.component';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { ShineCardComponent } from './shine/shine-card/shine-card.component';
import { ShineComponent } from './shine/shine/shine.component';
import { BabyCareComponent } from './shine/Baby-care/Baby-care.component';
import { BodyCareComponent } from './shine/Body-care/Body-care.component';
import { FaceCareComponent } from './shine/face-care/face-care.component';
import { HairCareComponent } from './shine/Hair-care/Hair-care.component';
import { NewLaunchesComponent } from './shine/New-Launches/New-Launches.component';
import { SkinCareComponent } from './shine/Skin-care/Skin-care.component';
import { ShineHomeComponent } from './shine/shine-home/shine-home.component';
import { ShineproductsComponent } from './shine/shineproducts/shineproducts.component';
import { PickProductComponent } from './shine/pick-product/pick-product.component';
import { ShineFooterComponent } from './shine/shine-footer/shine-footer.component';
import { ProductExplainComponent } from './shine/productExplain/productExplain.component';
import { ShineProductViewComponent } from './shine/shine-product-view/shine-product-view.component';
import { AuthService } from './services/auth.service';
import { Image360ViewComponent } from './image-360-view/image-360-view.component';
import { ProductIngredientsComponent } from './shine/product-ingredients/product-ingredients.component';
import { KpnrunnerComponent } from './kpnrunner/kpnrunner.component';
import { AdminLoginComponent } from './admin/admin/admin-login/admin-login.component';

import { DashboardComponent } from './admin/admin/dashboard/dashboard.component';
import { DiscountsOffersComponent } from './admin/admin/discounts-offers/discounts-offers.component';
import { OrderManagementComponent } from './admin/admin/order-management/order-management.component';
import { OverviewComponent } from './admin/admin/overview/overview.component';
import { ProductManagementComponent } from './admin/admin/product-management/product-management.component';
import { ReportsAnalyticsComponent } from './admin/admin/reports-analytics/reports-analytics.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CustomerBehaviorComponent } from './admin/admin/customer-behavior/customer-behavior.component';
import { OutOfStockProductComponent } from './admin/admin/out-of-stock-product/out-of-stock-product.component';
import { PendingOrderComponent } from './admin/admin/pending-order/pending-order.component';
import { ProductListComponent } from './admin/admin/product-list/product-list.component';
import { ShippingDetailComponent } from './admin/admin/shipping-detail/shipping-detail.component';
import { SummaryCardComponent } from './admin/admin/summary-card/summary-card.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BestSelleerComponent } from './shine/best-selleer/best-selleer.component';
import { CustomerManagementComponent } from './admin/admin/customer-management/customer-management.component';
import { ReviewComponent } from './review/review.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { FavoritproductComponent } from './favoritproduct/favoritproduct.component';
import { AdminApproveReviewComponent } from './admin/admin/admin-approve-review/admin-approve-review.component';
import { WhatsAppButtonComponent } from './WhatsAppButton/WhatsAppButton.component';
import { FlashOffersComponent } from './flash-offers/flash-offers.component';
import { OfferManagementComponent } from './admin/admin/offer-management/offer-management.component';
import { ShineProductAddComponent } from './admin/admin/shine-product-add/shine-product-add.component';
import { CancellationAndRefundComponent } from './company-terms/Cancellation-and-Refund/Cancellation-and-Refund.component';
import { PrivacyPolicyComponent } from './company-terms/privacy-policy/privacy-policy.component';
import { ShippingAndDeliveryComponent } from './company-terms/Shipping-and-Delivery/Shipping-and-Delivery.component';
import { TermsAndConditionComponent } from './company-terms/Terms-and-condition/Terms-and-condition.component';











@NgModule({
declarations: [
    AppComponent,
    SheshineComponent,

    NavtabComponent,
    HomeComponent,
    ContactComponent,
    AboutComponent,
    ProductsComponent,
    LoginComponent,
    SignupComponent,
    CartComponent,
    ProductOrderComponent,
    ProductCardComponent,
    AddressListComponent,
    AddAddressComponent,
    PaymentComponent,
    TogglingComponent,
    ProductViewDetailsComponent,
    SearchBarComponent,
    FeatureComponent,
    TrendingComponent,
    SpecialComponent,
    TestmonialComponent,
    CustomerComponent,
    FooterComponent,
    UserProfileComponent,
    ShineComponent,
    ShineCardComponent,
    BabyCareComponent,
    BodyCareComponent,
    FaceCareComponent,
    HairCareComponent,
    NewLaunchesComponent,
    SkinCareComponent,
    ShineHomeComponent,
    ShineproductsComponent,
    PickProductComponent,
    ShineProductViewComponent,
    ShineFooterComponent,
    ProductExplainComponent,
    Image360ViewComponent,
    ProductIngredientsComponent,
    KpnrunnerComponent,
    AdminLoginComponent,
    DashboardComponent,
    DiscountsOffersComponent,
    OrderManagementComponent,
    OverviewComponent,
    ProductManagementComponent,
    ReportsAnalyticsComponent,
    ForgotPasswordComponent,
    CustomerBehaviorComponent,
    OutOfStockProductComponent,
    PendingOrderComponent,
    ProductListComponent,
    ShippingDetailComponent,
    SummaryCardComponent,
    ResetPasswordComponent,
    BestSelleerComponent,
    CustomerManagementComponent,
    ReviewComponent,
    VerifyAccountComponent,
    OrderListComponent,
    OrderDetailsComponent,
    FavoritproductComponent,
    AdminApproveReviewComponent,
      WhatsAppButtonComponent,
    FlashOffersComponent,
      OfferManagementComponent,
      ShineProductAddComponent,
      CancellationAndRefundComponent,
      PrivacyPolicyComponent,
      ShippingAndDeliveryComponent,
      TermsAndConditionComponent


   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    AuthService,

    provideHttpClient(withFetch())
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
