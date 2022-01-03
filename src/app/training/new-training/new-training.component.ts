import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TrainingService} from "../training.service";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";
import {Exercise} from "../exercise.model";
import {Store} from "@ngrx/store";
import * as fromTraining from "../training.reducer"
import * as fromRoot from "../../app.reducer"

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {
  @Output() startWorkoutEmitter = new EventEmitter<void>()
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;

  constructor(private trainingService: TrainingService,
              private store: Store<fromTraining.State>,
  ) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises)

    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercise();
  }

  onStartWorkout(form: NgForm) {
    this.trainingService.startExercise(form.value.selectedExerciseId);
  }

}
