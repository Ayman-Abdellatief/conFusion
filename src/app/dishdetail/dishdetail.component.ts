import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from './../shared/dish';
import { switchMap } from 'rxjs/operators'; 
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Feedback,ContactType } from './../shared/feedback';
import { Comment } from './../shared/Comment';
import {visibility,flyInOut,expand} from '../animations/app.animation';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display:block;'
  },
  animations:[
    flyInOut(),
    visibility(),
    expand()
  ]

})
export class DishdetailComponent implements OnInit {
  dish:Dish ;
  errMess : string;
  dishIds: string[];
  prev: string;
  next: string;

  feedbackFormdetail: FormGroup;
  feedbackdetail: Feedback;
  contactType = ContactType;
  comment :Comment;
  date = new Date();
  newDate= this.date.toISOString();
@ViewChild('fform') FeedbackFormDirective;
dishcopy:Dish;
visibility = 'shown';

formErrors = {
  'author': '',
  'rating': '',
  'comment': ''
};

validationMessages = {
  'author': {
    'required':      'author is required.',
    'minlength':     'author must be at least 2 characters long.'
  },
  'comment': {
    'required':      'comment is required.'
  },
  
};




  constructor(private dishservice:DishService,
    private location:Location,
    private route:ActivatedRoute,private fb: FormBuilder,
    @Inject('baseURL')private BaseURL) {
    this.createForm();

     }

     createForm() {
      this.feedbackFormdetail = this.fb.group({
        author: ['',[Validators.required,Validators.minLength(2)]],
        rating:  ['5'],
        comment:  ['',Validators.required]
       
      });
  
      this.feedbackFormdetail.valueChanges
      .subscribe(data => this.onValueChanged(data));
      
      this.onValueChanged();
    }
  
    onValueChanged(data?:any){
      if(!this.feedbackFormdetail) {return ;}
      const form = this.feedbackFormdetail;
      for (const field in this.formErrors){
        if(this.formErrors.hasOwnProperty(field)){
            // clear
              this.formErrors[field] = '';
              const control =form.get(field);
                if(control && control.dirty && !control.valid){
                  const messages = this.validationMessages[field];
                  for(const key in control.errors){
                    if(control.errors.hasOwnProperty(key)){
                      this.formErrors[field] +=messages[key] + ' ';
                    }
                  }
                }   
        }
      }
    }
  
  


  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
    .pipe(switchMap((params: Params) => {this.visibility ='hidden'; return  this.dishservice.getDish(params['id']);}))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id);this.visibility ='shown'; },
      errmess => this.errMess = <any>errmess )
    }

    
    onSubmit() {
      this.comment = this.feedbackFormdetail.value;
      console.log(this.comment );
      this.comment.date = this.newDate;
      console.log(this.comment)
      this.dishcopy.comments.push(this.comment);
      this.dishservice.putDish(this.dishcopy)
        .subscribe(dish => {
          this.dish = dish; this.dishcopy = dish;
        },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
      this.FeedbackFormDirective.resetForm();
      this.feedbackFormdetail.reset({
        author:'',
        rating:'5',
        Comment:''
        
      });
         
         
    }
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
    
  goBack(): void {
    this.location.back();
  }

}
