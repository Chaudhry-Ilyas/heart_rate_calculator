from django.dispatch import receiver
from django.db.models.signals import post_delete
from django.contrib.auth.models import User
from django.conf import settings

import os
from shutil import rmtree


@receiver(signal=post_delete, sender=User)
def delete_user_folder_on_delete(sender, instance, **kwargs):
    user_path = os.path.join(settings.MEDIA_ROOT, f"user_{instance.id}")
    if os.path.isdir(user_path):
        rmtree(user_path)
