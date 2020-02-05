import { VOID } from "@/app/core/operators";
import { Injectable } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { Actions, ofActionSuccessful, Store } from "@ngxs/store";
import { EMPTY, from, iif, Observable, race } from "rxjs";
import { map, switchMap, switchMapTo, tap } from "rxjs/operators";
import { AuthActions } from "../auth.actions";
import { AuthMethod, AuthRequestOptions } from "../auth.types";
import { AuthModal } from "./auth.modal";

@Injectable()
export class AuthController {
	constructor(
		private store: Store,
		private actions$: Actions,
		private modalCtrl: ModalController,
		private alertCtrl: AlertController,
	) {}

	/**
	 * Request an authorization and wait for an event emitted when the user interacts
	 */
	public request(options?: AuthRequestOptions) {
		return this.confirmTouchId().pipe(
			switchMap(status => iif(() => status, VOID, this.openPinModal())),
		);
	}

	private openPinModal(): Observable<void> {
		const pinDialog = this.modalCtrl.create({
			component: AuthModal,
		});

		const dismiss$ = this.actions$.pipe(
			ofActionSuccessful(AuthActions.Dismiss),
			switchMapTo(EMPTY),
		);

		const authorized$ = this.actions$.pipe(
			ofActionSuccessful(AuthActions.Authorize),
			switchMapTo(VOID),
		);

		const pin$ = from(pinDialog).pipe(
			tap(modal => modal.present()),
			switchMapTo(race(authorized$, dismiss$)),
		);

		return pin$;
	}

	private confirmTouchId(): Observable<boolean> {
		const touchIdDialog = this.alertCtrl.create({
			message: "Touch ID",
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
				},
				{
					text: "Ok",
					role: "ok",
				},
			],
		});

		return from(touchIdDialog).pipe(
			tap(alert => alert.present()),
			tap(() =>
				this.store.dispatch(
					new AuthActions.SetMethod(AuthMethod.TouchID),
				),
			),
			switchMap(alert => from(alert.onDidDismiss())),
			map(({ role }) => role === "ok"),
		);
	}
}
