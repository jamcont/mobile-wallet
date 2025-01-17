import { Component, OnDestroy, OnInit } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import {
	AlertController,
	ModalController,
	NavController,
	Platform,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import * as constants from "@/app/app.constants";
import { AuthController } from "@/app/auth/shared/auth.controller";
import { ViewerLogModal } from "@/components/viewer-log/viewer-log.modal";
import { UserSettings } from "@/models/model";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

const packageJson = require("@@/package.json");

@Component({
	selector: "page-settings",
	templateUrl: "settings.html",
	styleUrls: ["settings.scss"],
	providers: [InAppBrowser],
})
export class SettingsPage implements OnInit, OnDestroy {
	public objectKeys = Object.keys;

	public availableOptions;
	public currentSettings: UserSettings;
	public appVersion: number = packageJson.version;
	public versionClicksCount = 0;

	public currentWallet;

	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		public platform: Platform,
		private navCtrl: NavController,
		private settingsDataProvider: SettingsDataProvider,
		private alertCtrl: AlertController,
		private translateService: TranslateService,
		private modalCtrl: ModalController,
		private inAppBrowser: InAppBrowser,
		private userDataService: UserDataService,
		private toastProvider: ToastProvider,
		private authCtrl: AuthController,
	) {
		this.availableOptions = this.settingsDataProvider.AVALIABLE_OPTIONS;
		this.currentWallet = this.userDataService.currentWallet;
	}

	openChangePinPage() {
		this.authCtrl.update();
	}

	openManageNetworksPage() {
		this.navCtrl.navigateForward("/network-overview");
	}

	openPrivacyPolicy() {
		return this.inAppBrowser.create(
			constants.PRIVACY_POLICY_URL,
			"_system",
		);
	}

	confirmClearData() {
		this.translateService
			.get([
				"CANCEL",
				"CONFIRM",
				"ARE_YOU_SURE",
				"SETTINGS_PAGE.CLEAR_DATA_TEXT",
			])
			.subscribe(async (translation) => {
				const confirm = await this.alertCtrl.create({
					header: translation.ARE_YOU_SURE,
					message: translation["SETTINGS_PAGE.CLEAR_DATA_TEXT"],
					buttons: [
						{
							text: translation.CANCEL,
						},
						{
							text: translation.CONFIRM,
							handler: () => {
								this.authCtrl
									.request()
									.pipe(tap(() => this.clearData()))
									.subscribe();
							},
						},
					],
				});

				confirm.present();
			});
	}

	async presentLogReport() {
		const viewerLogModal = await this.modalCtrl.create({
			component: ViewerLogModal,
		});

		await viewerLogModal.present();
	}

	handleVersionClicks() {
		if (this.currentSettings.devMode) {
			return;
		}

		this.versionClicksCount += 1;
		if (this.versionClicksCount === 5) {
			this.enableDevMode();
		}
	}

	enableDevMode() {
		this.versionClicksCount = 0;
		this.currentSettings.devMode = true;
		this.onUpdate();
		this.toastProvider.show("SETTINGS_PAGE.YOU_ARE_DEVELOPER");
	}

	onUpdate() {
		this.settingsDataProvider.save(this.currentSettings);
	}

	ngOnInit() {
		this.settingsDataProvider.settings
			.pipe(
				takeUntil(this.unsubscriber$),
				tap((settings) => (this.currentSettings = settings)),
			)
			.subscribe();

		this.settingsDataProvider.onUpdate$
			.pipe(
				takeUntil(this.unsubscriber$),
				tap((settings) => (this.currentSettings = settings)),
			)
			.subscribe();
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	private clearData() {
		this.settingsDataProvider.clearData().subscribe(() => {
			this.navCtrl.navigateRoot("/onboarding");
		});
	}
}
