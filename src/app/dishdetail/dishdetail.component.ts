import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from './../shared/dish';
import { switchMap } from 'rxjs/operators'; 
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Feedback,ContactType } from './../shared/feedback';
import { Comment } from './../shared/Comment';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {
  dish:Dish ;
  dishIds: string[];
  prev: string;
  next: string;

  feedbackFormdetail: FormGroup;
  feedbackdetail: Feedback;
  contactType = ContactType;
  comments :Comment;
  date = new Date();
  newDate= this.date.toISOString();
@ViewChild('fform') FeedbackFormDirective;


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
        comment:  ['',Validators.required],
        rating:  ['5']
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
  
  
    onSubmit() {
      this.comments  = this.feedbackFormdetail.value;
      console.log(this.comments );
      this.feedbackFormdetail.reset({
        author:'',
        Comment:'',
        rating:'5'
      });
          this.FeedbackFormDirective.resetForm();
          this.comments.date = this.newDate;
          this.dish.comments.push(this.comments);
    }
  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
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
