import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "auth-pin",
	templateUrl: "auth-pin.component.html",
})
export class AuthPinComponent {
	@Input()
	public isBlocked: boolean;

	@Input()
	public unlockDate: Date | undefined;

	@Output()
	public authorized = new EventEmitter<void>();

	@Output()
	public failed = new EventEmitter<void>();

	constructor() {}

	public authorize() {
		this.authorized.next();
	}

	public fail() {
		this.failed.next();
	}
}
