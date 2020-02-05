import { SharedModule } from "@/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { AuthPinComponent } from "./auth-pin.component";

@NgModule({
	declarations: [AuthPinComponent],
	imports: [SharedModule],
	exports: [AuthPinComponent],
})
export class AuthPinModule {}
