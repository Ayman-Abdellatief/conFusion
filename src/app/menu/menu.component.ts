import { Component, OnInit,Inject } from '@angular/core';

import { Dish } from './../shared/dish';
import { from } from 'rxjs';
import { DishService } from './../services/dish.service';
import { inject } from '@angular/core/testing';
import { baseURL } from './../shared/baseurl';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  dishes: Dish[] ;
  errMess : string;

  constructor(private  dishservice:DishService,
    @Inject('baseURL') private BaseURL) {}

  ngOnInit(): void {
     this.dishservice.getDishes()
    .subscribe(dishes => this.dishes = dishes,
      errmess => this.errMess = <any>errmess);
  }

    
}
