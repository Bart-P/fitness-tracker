import {Exercise} from "./exercise.model";
import {Injectable} from "@angular/core";
import {catchError, map, Subscription, take} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UIService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
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
          throw new Error();
        }))
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetAvailableTraining(exercises))
          this.store.dispatch(new UI.StopLoading())
        }));
  }

  startExercise(exerciseID: string) {
    this.store.dispatch(new Training.StartTraining(exerciseID));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addExerciseToDb({...ex, date: new Date(), state: 'completed'});
    })
    this.store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addExerciseToDb({
        ...ex,
        duration: ex.duration * (progress / 100),
        caloriesBurned: ex.caloriesBurned * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    })
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
