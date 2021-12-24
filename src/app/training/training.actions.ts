import {Action} from "@ngrx/store";
import {Exercise} from "./exercise.model";

export const SET_AVAILABLE_TRAINING = '[Training] Set available training';
export const SET_FINISHED_TRAINING = '[Training] Set finished training';
export const START_TRAINING = '[Training] Start training'
export const STOP_TRAINING = '[Training] Stop training'

export class SetAvailableTraining implements Action {
  readonly type = SET_AVAILABLE_TRAINING;

  constructor(public payload: Exercise[]) {
  }
}

export class SetFinishedTraining implements Action {
  readonly type = SET_FINISHED_TRAINING;

  constructor(public payload: Exercise[]) {
  }
}

export class StartTraining implements Action {
  readonly type = START_TRAINING;

  constructor(public payload: string) {
  }
}

export class StopTraining implements Action {
  readonly type = STOP_TRAINING;
}

export type TrainingActions =
  SetAvailableTraining
  | SetFinishedTraining
  | StartTraining
  | StopTraining;
