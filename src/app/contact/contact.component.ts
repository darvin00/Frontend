import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactService } from '../services/contact.service'; // Adjust the import path based on your file structure

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  constructor(private contactService: ContactService) {}

  // Function to handle form submission
  onSubmit(form: NgForm) {
    if (form.valid) {
      const contactData = {
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        message: form.value.message
      };


      // Call the service to send the contact form data
      this.contactService.submitContactForm(contactData).subscribe(
        response => {

          // Handle success response
        },
        error => {
          
          // Handle error response
        }
      );
       // Show success popup
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your message has been sent successfully!',
        confirmButtonText: 'OK'
      }).then(() => {
        // Reset the form after the popup is closed
        form.reset();
      });




    }
    else
    {

       // Show error popup if form is invalid
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill out the form correctly.',
        confirmButtonText: 'OK'
      })
    }
  }
}
