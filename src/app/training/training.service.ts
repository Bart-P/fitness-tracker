import {Exercise} from "./exercise.model";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  private availableExercises: Exercise[] = [
    {id: 'crunches', name: 'Crunches', duration: 30, caloriesBurned: 8},
    {id: 'touch-toes', name: 'Touch Toes', duration: 180, caloriesBurned: 15},
    {id: 'side-lunges', name: 'Side Lunges', duration: 120, caloriesBurned: 18},
    {id: 'burpees', name: 'Burpees', duration: 60, caloriesBurned: 8}
  ];

  getAvailableExercise(): Exercise[] {
    return this.availableExercises.slice();
  }

  startExercise(exerciseID: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === exerciseID)
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.exercises.push({...this.runningExercise, date: new Date(), state: 'completed'});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      caloriesBurned: this.runningExercise.caloriesBurned * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  getCompletedExercises() {
    return this.exercises.slice();
  }
}
