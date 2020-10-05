import { Injectable } from '@angular/core';
import { Leader } from './../shared/leader';
import { LEADERS } from './../shared/Leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }


  
  getLeaders(): Promise<Leader[]>{
    return new Promise(resolve =>{
      //Simulate server
      setTimeout(() =>resolve(LEADERS),2000);
    });
  }

  getLeader(id:string):Promise<Leader>{
    return new Promise(resolve =>{
      //Simulate server
      setTimeout(() =>resolve(LEADERS.filter((Leader) => (Leader.id === id))[0]),2000);
    });
  }

  getFeaturedLeader():Promise<Leader>{
    return new Promise(resolve =>{
      //Simulate server
      setTimeout(() =>resolve(LEADERS.filter((Leader) => (Leader.featured))[0]),2000);
    });
  }
}
