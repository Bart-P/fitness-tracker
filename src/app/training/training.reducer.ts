import {Exercise} from "./exercise.model";
import * as fromRoot from '../app.reducer';
import {
  SET_AVAILABLE_TRAINING,
  SET_FINISHED_TRAINING,
  START_TRAINING,
  STOP_TRAINING,
  TrainingActions
} from "./training.actions";
import {createFeatureSelector, createSelector} from "@ngrx/store";

export interface TrainingState {
  availableExercises: Exercise[],
  finishedExercises: Exercise[],
  activeExercise: Exercise,
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeExercise: null,
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAINING:
      return {
        ...state,
        availableExercises: action.payload
      };
    case SET_FINISHED_TRAINING:
      return {
        ...state,
        finishedExercises: action.payload
      };
    case START_TRAINING:
      return {
        ...state,
        activeExercise: {
          ...state.availableExercises.find(ex => ex.id ===
            action.payload)
        }
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeExercise: null
      };
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeExercise);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeExercise != null);
