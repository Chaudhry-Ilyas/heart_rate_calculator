from django.dispatch import receiver
from django.db.models.signals import pre_delete
from ..models import PhotoacousticFile


@receiver(signal=pre_delete, sender=PhotoacousticFile)
def clear_photoacoustic_file_on_delete(sender, instance, **kwargs):
    # Clear the file field
    instance.file.delete(save=False)
