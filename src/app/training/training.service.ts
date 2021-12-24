import {Exercise} from "./exercise.model";
import {Injectable} from "@angular/core";
import {catchError, map, Subject, Subscription} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UIService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private firebaseSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService,
              private store: Store<fromTraining.State>,
  ) {
  }

  fetchAvailableExercise() {
    this.store.dispatch(new UI.StartLoading())
    this.firebaseSubs.push(
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
        }), catchError(() => {
          this.store.dispatch(new UI.StopLoading())
          this.uiService.showSnackBar("Fetching available exercises failed, please try" +
            " again later", null, 5000);
          this.exercisesChanged.next(null);
          throw new Error();
        }))
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetAvailableTraining(exercises))
          this.store.dispatch(new UI.StopLoading())
        }));
  }

  startExercise(exerciseID: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === exerciseID)
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.addExerciseToDb({...this.runningExercise, date: new Date(), state: 'completed'});
    this.store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress: number) {
    this.addExerciseToDb({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      caloriesBurned: this.runningExercise.caloriesBurned * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.store.dispatch(new Training.StopTraining());
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedExercises() {
    this.firebaseSubs.push(
      this.db.collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetFinishedTraining(exercises))
        }));
  }

  private addExerciseToDb(exercise: Exercise) {
    this.db.collection('finishedExercises')
      .add(exercise)
      .then(() =>
        this.uiService
          .showSnackBar(
            'Finished training saved to database.',
            null,
            5000
          )
      );
  }

  cancelSubscriptions() {
    this.firebaseSubs.forEach(sub => {
        if (sub) sub.unsubscribe();
      }
    )
  };
}
