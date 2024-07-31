from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ..forms import PhotoacousticFileForm
from ..models import PhotoacousticFile
from ..serializer import PhotoacousticFileSerializer

from ..utils.read_fir_csv import getHeartrate


# TODO: Set the api_view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def uploadPhotoacousticFile(request):
    try:
        form = PhotoacousticFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = form.save(commit=False)
            file.user = request.user
            file.save()
            return Response({"message": "File saved!"}, status=status.HTTP_200_OK)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# TODO: Set the api_view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserPhotoacousticFiles(request):
    user = request.user
    try:
        files = PhotoacousticFile.objects.filter(user=user)
        files_serialized = PhotoacousticFileSerializer(files, many=True)
        return Response({"files": files_serialized.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# TODO: Set the api_view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deletePhotoacousticFile(request):
    try:
        file_id = request.data.get('file_id')
        if not file_id:
            return Response({"error": "File ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        file = PhotoacousticFile.objects.get(id=file_id, user=request.user)
        file.delete()
        return Response({"message": "File deleted!"}, status=status.HTTP_200_OK)
    except PhotoacousticFile.DoesNotExist:
        return Response({"error": "File not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# TODO: Set the api_view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculateHeartrate(request):
    try:
        file_id = request.data.get('file_id')
        sampling_frequency = request.data.get('sampling_frequency')
        file = PhotoacousticFile.objects.get(id=file_id, user=request.user)
        
        # Assuming getHeartrate is a function that takes file path and sampling frequency to calculate heart rate
        heartrate = getHeartrate(file.file.path, sampling_frequency)
        
        return Response({"heartrate": heartrate}, status=status.HTTP_200_OK)
    except PhotoacousticFile.DoesNotExist:
        return Response({"error": "File not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
