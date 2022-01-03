import {Component, OnInit} from '@angular/core';
import {TrainingService} from "./training.service";
import * as fromTraining from "./training.reducer";
import {TrainingState} from "./training.reducer";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  ongoingWorkout$: Observable<boolean>;

  constructor(private trainingService: TrainingService, private store: Store<TrainingState>) {
  }

  ngOnInit(): void {
    this.ongoingWorkout$ = this.store.select(fromTraining.getIsTraining);
  }

}
