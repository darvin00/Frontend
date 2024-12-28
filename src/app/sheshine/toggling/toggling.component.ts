import { Component, OnInit } from '@angular/core';
import {  Input } from '@angular/core';

@Component({
  selector: 'app-toggling',
  templateUrl: './toggling.component.html',
  styleUrls: ['./toggling.component.scss']
})
export class TogglingComponent implements OnInit {
  isLogin: boolean = true;
  // @Input() isLogin!: boolean;

  constructor() {}

  ngOnInit() {}

  toggle() {
    this.isLogin = !this.isLogin;
  }
   onToggleLogin(event: boolean) {
    this.isLogin = event;
  }
}
