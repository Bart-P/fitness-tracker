import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TrainingService} from "../training.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Exercise} from "../exercise.model";
import {UIService} from "../../shared/ui.service";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() startWorkoutEmitter = new EventEmitter<void>()
  exerciseSubscription: Subscription;
  exercises: Exercise[];
  isLoading = true;
  loadingSubscription: Subscription;

  constructor(private trainingService: TrainingService,
              private uiService: UIService,
  ) {
  }

  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.exerciseSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => this.exercises = exercises);

    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercise();
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) this.exerciseSubscription.unsubscribe();
    if (this.loadingSubscription) this.loadingSubscription.unsubscribe();
  }

  onStartWorkout(form: NgForm) {
    this.trainingService.startExercise(form.value.selectedExerciseId);
  }

}
