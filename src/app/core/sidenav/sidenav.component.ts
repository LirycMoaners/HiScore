import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { HeaderService } from '../header/header.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  menuItems = [
    { label: 'Home', link: '/game-list', icon: 'home' },
    { label: 'New game', link: '/game-edition', icon: 'add_circle' },
    { label: 'Help', link: '/help', icon: 'help' },
    { label: 'About', link: '/about', icon: 'info' },
  ];

  constructor(
    public headerService: HeaderService
  ) { }

  ngOnInit(): void {}

}
