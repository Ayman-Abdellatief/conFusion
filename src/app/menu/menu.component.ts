import { Component, OnInit } from '@angular/core';

import { Dish } from './../shared/dish';
import { from } from 'rxjs';
import { DishService } from './../services/dish.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  dishes: Dish[] ;

  SelectedDish : Dish ;
  constructor(private  dishservice:DishService) {}

  ngOnInit(): void {
     this.dishservice.getDishes()
    .subscribe(dishes => this.dishes = dishes);
  }

  onSelect(dish:Dish){
    this.SelectedDish = dish;
    }
    
}
