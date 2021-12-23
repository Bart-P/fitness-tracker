import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TrainingService} from "../training.service";
import {NgForm} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {Exercise} from "../exercise.model";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../app.reducer'

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() startWorkoutEmitter = new EventEmitter<void>()
  exerciseSubscription: Subscription;
  exercises: Exercise[];
  isLoading$: Observable<boolean>;
  loadingSubscription: Subscription;

  constructor(private trainingService: TrainingService,
              private store: Store<fromRoot.State>,
  ) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.exerciseSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => this.exercises = exercises);

    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercise();
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) this.exerciseSubscription.unsubscribe();
  }

  onStartWorkout(form: NgForm) {
    this.trainingService.startExercise(form.value.selectedExerciseId);
  }

}
