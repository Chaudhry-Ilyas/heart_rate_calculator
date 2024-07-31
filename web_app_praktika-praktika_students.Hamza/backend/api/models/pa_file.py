from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

def user_directory_pa_file(instance, filename):
    # Generate the directory path for the file upload
    date_str = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"user_{instance.user.id}/photoacoustic/{date_str}_{filename}"

class PhotoacousticFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=50, unique=True)
    file = models.FileField(upload_to=user_directory_pa_file)
    upload_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name
