import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'angular-supaship-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnChanges {
  @Input() allowClose = true;
  @Input() open = false;
  @Output() dialogStateChange = new EventEmitter<boolean>();
  isOpen = false;
  @ViewChild('contentsContainer') contentContainer!: ElementRef<HTMLDivElement>;

  @HostListener('window:keydown.escape', ['$event'])
  keyEvent(_event: KeyboardEvent) {
    if (!this.allowClose) {
      return;
    }
    if (this.isOpen) {
      this.toggleOpen(false);
    }
  }

  backGroundClick(event: any) {
    if (this.contentContainer.nativeElement.contains(event.target)) {
      return;
    }
    if (this.allowClose) {
      this.toggleOpen(false);
    }
  }

  toggleOpen(targetOpenState: boolean) {
    this.isOpen = targetOpenState;
    this.dialogStateChange.emit(targetOpenState);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.contentContainer);
    if (changes['open']) {
      if (this.isOpen !== this.open) {
        this.toggleOpen(this.open);
      }
    }
  }
}

// export interface DialogProps {
//   allowClose?: boolean;
//   contents: React.ReactNode;
//   open: boolean;
//   dialogStateChange?: (open: boolean) => void;
// }

// export default function Dialog({
//   allowClose = true,
//   contents,
//   open,
//   dialogStateChange = () => {},
// }: DialogProps) {
//   const [showModal, setShowModal] = useState(open);
//   const dialog = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (open !== showModal) {
//       setShowModal(open);
//     }
//   }, [open]);

//   function updateDialogState(open: boolean) {
//     setShowModal(open);
//     dialogStateChange(open);
//   }

//   return showModal ? (
//     <>
// <div class="opacity-75 fixed inset-0 z-40 bg-black"></div>
// <div
//   onClick={({ target }) => {
//     if (!allowClose || dialog.current?.contains(target as any)) {
//       return;
//     }
//     updateDialogState(false);
//   }}
//   onKeyDown={({ key }) => {
//     if (!allowClose || key !== "Escape") {
//       return;
//     }
//     updateDialogState(false);
//   }}
//   class="justify-center items-start mt-12 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-screen"
// >
//   <div class="relative my-6 mx-auto w-128">
//     <div class="relative group">
//       <div class="absolute -inset-0.5 bg-gradient-to-r from-green-200 to-green-600 rounded-lg blur-lg opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-2000"></div>
//       <div
//         ref={dialog}
//         class="relative p-6 bg-black rounded-lg grid place-content-center"
//       >
//         {contents}
//       </div>
//     </div>
//   </div>
// </div>
//     </>
//   ) : null;
// }
