import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Actions, ofActionSuccessful, Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AuthActions } from "../auth.actions";
import { AUTH_STATE_TOKEN, AuthState } from "../auth.state";
import { AuthStateModel } from "../auth.types";

@Component({
	templateUrl: "auth.modal.html",
})
export class AuthModal implements OnInit, OnDestroy {
	@Select(AUTH_STATE_TOKEN)
	public state$: Observable<AuthStateModel>;

	@Select(AuthState.isBlocked)
	public isBlocked$: Observable<boolean>;

	constructor(
		private store: Store,
		private actions$: Actions,
		private modalCtrl: ModalController,
	) {}

	ngOnInit() {
		this.actions$
			.pipe(ofActionSuccessful(AuthActions.Authorize))
			.subscribe(() => this.modalCtrl.dismiss());
	}

	ngOnDestroy() {
		this.store.dispatch(new AuthActions.Dismiss());
	}

	public authorized() {
		this.store.dispatch(new AuthActions.Authorize());
	}

	public failed() {
		this.store.dispatch(new AuthActions.IncreaseAttempts());
	}
}
