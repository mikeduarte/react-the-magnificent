
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface CardTrickDialogProps {
    open: boolean,
    content: {
        title: string
        message: string,
        button?: string
    }
    close: () => void
}

export default function CardTrickDialog({ open, close, content } : CardTrickDialogProps) {

  return (
    <div>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" dangerouslySetInnerHTML={{__html: content.title}}></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" dangerouslySetInnerHTML={{__html: content.message}}></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>{content.button}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}