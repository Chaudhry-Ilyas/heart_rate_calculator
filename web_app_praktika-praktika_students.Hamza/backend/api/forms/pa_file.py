import os
from django import forms
from ..models import PhotoacousticFile

class PhotoacousticFileForm(forms.ModelForm):
    class Meta:
        model = PhotoacousticFile
        fields = ("file_name", "file")

    def clean_file(self):
        file = self.cleaned_data.get("file", False)
        if file:
            # Get the file extension
            file_extension = os.path.splitext(file.name)[1].lower()
            # Define the allowed extension(s)
            valid_extensions = ['.csv']
            if file_extension not in valid_extensions:
                raise forms.ValidationError("Uploaded file has unsupported extension!")

        return file
