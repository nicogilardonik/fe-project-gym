import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ImageModalComponent } from '@shared/components/image-modal/image-modal.component';
import {
  GetClientById,
  PlanClient,
  RoutineClient,
} from '@features/client/state/clients.actions';
import { ClientsState } from '@features/client/state/clients.state';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ClientDetailInfoComponent } from '../../components/client-detail-info/client-detail-info.component';
import { ClientDetailRoutineComponent } from '../../components/client-detail-routine/client-detail-routine.component';
import { ClientDetailPlanComponent } from '../../components/client-detail-plan/client-detail-plan.component';
import { ClientDetailSchedulesComponent } from '../../components/client-detail-schedules/client-detail-schedules.component';

@Component({
  selector: 'app-detail-client',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatTabsModule,
    MatDialogModule,
    ClientDetailInfoComponent,
    ClientDetailRoutineComponent,
    ClientDetailPlanComponent,
    ClientDetailSchedulesComponent,
  ],
  templateUrl: './detail-client.component.html',
  styleUrl: './detail-client.component.css',
})
export class DetailClientComponent implements OnInit, OnDestroy {
  id: string = '';
  selectedClient$: Observable<any> | undefined;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private actions: Actions,
    private dialog: MatDialog,
  ) { }

  private destroy = new Subject<void>();

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.selectedClient$ = this.store.select(ClientsState.getSelectedClient);
    if (this.id) {
      this.store.dispatch(new GetClientById(this.id));
      this.actions
        .pipe(ofActionSuccessful(GetClientById), takeUntil(this.destroy))
        .subscribe(() => {
          this.store
            .select((state) => state.clients.selectedClient)
            .pipe(takeUntil(this.destroy))
            .subscribe(() => { });
          this.store.dispatch(new RoutineClient()).subscribe();
          this.store.dispatch(new PlanClient()).subscribe();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  openAvatarModal(imageUrl: string, name: string): void {
    if (!imageUrl) return;
    this.dialog.open(ImageModalComponent, {
      data: { imageUrl, altText: name || 'Avatar' },
      panelClass: ['bg-transparent'],
      backdropClass: ['cdk-overlay-dark-backdrop']
    });
  }
}
