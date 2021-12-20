import {Exercise} from "./exercise.model";
import {Injectable} from "@angular/core";
import {map, Subject} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;

  constructor(private db: AngularFirestore) {
  }

  fetchAvailableExercise() {
    this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docData => {
        return docData.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            caloriesBurned: doc.payload.doc.data()['caloriesBurned'],
          } as Exercise;
        })
      }))
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      })
  }

  startExercise(exerciseID: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === exerciseID)
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.addExerciseToDb({...this.runningExercise, date: new Date(), state: 'completed'});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addExerciseToDb({
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

  fetchCompletedExercises() {
    this.db.collection('finishedExercises').valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      })
  }

  private addExerciseToDb(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
