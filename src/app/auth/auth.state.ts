import { VOID } from "@/app/core/operators";
import {
	Action,
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { Observable } from "rxjs";
import { switchMapTo, tap } from "rxjs/operators";
import { AuthActions } from "./auth.actions";
import { AuthConfig } from "./auth.config";
import { AuthService } from "./auth.service";
import { AuthStateModel } from "./auth.types";

export const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>(
	AuthConfig.TOKEN,
);

const defaultState: AuthStateModel = {
	attempts: 0,
	isPending: false,
	method: undefined,
	unlockDate: undefined,
};

@State({
	name: AUTH_STATE_TOKEN,
	defaults: defaultState,
})
export class AuthState implements NgxsOnInit {
	@Selector()
	static isBlocked(state: AuthStateModel): boolean {
		return !!state.unlockDate;
	}

	constructor(private authService: AuthService) {}

	public ngxsOnInit(ctx: StateContext<AuthStateModel>) {
		this.authService.load().subscribe(data =>
			ctx.patchState({
				attempts: data.attempts,
				unlockDate: data.unlockDate,
			}),
		);
	}

	@Action(AuthActions.Dismiss)
	public dismiss(ctx: StateContext<AuthStateModel>): void {
		ctx.patchState({ isPending: false, method: undefined });
	}

	@Action(AuthActions.Authorize)
	public authorize(ctx: StateContext<AuthStateModel>): Observable<void> {
		return this.authService.reset().pipe(
			tap(() => ctx.patchState({ attempts: 0, unlockDate: undefined })),
			switchMapTo(VOID),
		);
	}

	@Action(AuthActions.IncreaseAttempts)
	public increaseAttempts(
		ctx: StateContext<AuthStateModel>,
	): Observable<void> {
		const { attempts } = ctx.getState();
		const newAttempts = attempts + 1;

		return this.authService.increaseAttempts(newAttempts).pipe(
			tap(data =>
				ctx.patchState({
					attempts: data.attempts,
					unlockDate: data.unlockDate,
				}),
			),
			switchMapTo(VOID),
		);
	}

	@Action(AuthActions.SetMethod)
	public setMethod(
		ctx: StateContext<AuthStateModel>,
		action: AuthActions.SetMethod,
	): void {
		ctx.patchState({
			isPending: true,
			method: action.method,
		});
	}
}
