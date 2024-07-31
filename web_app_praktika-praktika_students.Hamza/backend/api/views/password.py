from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.template.loader import render_to_string

from ..serializer import PasswordResetSerializer


class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            # TODO: Get a User with the E-Mail
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({"email": "No user found with this E-Mail Address!"},
                            status=status.HTTP_400_BAD_REQUEST)

        # Generate token and send email
        # TODO: encode the user id from the db
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        

        # TODO: Generate the Resetlink with the encoded user id and the user token
        frontend_url = "http://localhost:5173"
        reset_url = f"{frontend_url}/password_reset_confirm/{uid}/{token}/"

        subject = "Password Reset"
        # TODO: Set path to email template and give the function the reset_irl and username as context
        message = render_to_string(
            template_name="password_reset.html",
            context={"reset_url": reset_url, "username": user.username}
        )
        # TODO: Set the from_email to the admin e-mail and the recipient_list to the user e-mail address
        send_mail(
            subject,
            message,
            from_email="admin@hs-anhalt.de",
            
            recipient_list=[email]
        )

        return Response({"message": "Password reset E-Mail has been sent."}, status=status.HTTP_200_OK)


@api_view(['PUT'])
def passwordResetConfirm(request, uid_encode, token):
    try:
        # TODO: decode User ID
        uid = force_str(urlsafe_base64_decode(uid_encode))
        # TODO: Get User with the User ID
        user = User.objects.get(pk=uid)
    except ObjectDoesNotExist:
        return Response({"error": "Some server problems"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if user is not None and default_token_generator.check_token(user=user, token=token):
        data = request.data
        # TODO: check if new_password and new_password_confirm are the same
        new_password = data.get("new_password")
        new_password_confirm = data.get("new_password_confirm")
        if new_password != new_password_confirm:
            return Response({"error": "New passwords do not match!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(data["new_password"])
        user.save()

        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid token. Try reset again!"}, status=status.HTTP_400_BAD_REQUEST)
