from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator

from ..serializer import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        print("Received data:", request.data)  # Log received data
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        print("Validation errors:", serializer.errors)  # Debugging line
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteUser(request):
    try:
        # Get the user from the request (authenticated user)
        user = request.user

        # Delete the user
        user.delete()

        # Return a success response with status code 200
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        # Handle unexpected errors and return a response with status code 500
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# TODO: Set the api_view
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def changePassword(request):
    user = request.user
    data = request.data

    old_password = data.get("old_password")
    new_password = data.get("new_password")
    new_password_confirm = data.get("new_password_confirm")

    # Check if the old password is correct
    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the new password and confirm password are the same
    if new_password != new_password_confirm:
        return Response({"error": "New passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the new password and the old password are different
    if old_password == new_password:
        return Response({"error": "New password must be different from the old password."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if the new password is valid
        validate_password(new_password, user)
    except ValidationError as e:
        return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)

# TODO: Set the api_view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserInfo(request):
    user = request.user
    info = {
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_superuser": user.is_superuser,
    }
    return Response(info, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def setUserInfo(request):
    user = request.user
    data = request.data.get("sendInfo", {})
    new_email = data.get("email", "")

    # Check if 'email' is provided and is different from the current one
    if new_email and new_email != user.email:
        validator = EmailValidator()
        try:
            validator(new_email)
        except ValidationError:
            return Response({"error": "Insert a valid E-Mail Address"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email already exists
        if User.objects.filter(email=new_email).exists():
            return Response({"error": "E-Mail Address is already in use, please use another one."},
                            status=status.HTTP_400_BAD_REQUEST)

    try:
        # Update the user information
        user.username = data.get("username", user.username)
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = new_email or user.email  # Set new email only if it's provided and valid

        # Save the changes
        user.save()

        return Response({"message": "User information updated successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
