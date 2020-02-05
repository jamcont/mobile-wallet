import { AuthMethod } from "./auth.types";

export namespace AuthActions {
	export class SetMethod {
		static readonly type = "[Auth] SetMethod";
		constructor(public method: AuthMethod) {}
	}

	export class Block {
		static readonly type = "[Auth] Block";
		constructor() {}
	}

	export class Dismiss {
		static readonly type = "[Auth] Dismiss";
		constructor() {}
	}

	export class Unblock {
		static readonly type = "[Auth] Unblock";
		constructor() {}
	}

	export class Authorize {
		static readonly type = "[Auth] Authorize";
		constructor() {}
	}

	export class IncreaseAttempts {
		static readonly type = "[Auth] Increase Attempts";
		constructor() {}
	}
}
