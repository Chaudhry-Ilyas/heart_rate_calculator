from django.urls import path
from django.contrib import admin
from .views import (
    MyTokenObtainPairView,
    RegisterView,
    PasswordResetView,
    passwordResetConfirm,
    deleteUser,
    getUserInfo,
    setUserInfo,
    changePassword,
    uploadPhotoacousticFile,
    getUserPhotoacousticFiles,
    deletePhotoacousticFile,
    calculateHeartrate,
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [ 
    
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("password_reset/", PasswordResetView.as_view(), name="password_reset"),
    path("password_reset/<uid_encode>/<token>/", passwordResetConfirm, name="password_reset_confirm"),
    path("changePassword/", changePassword, name="changePassword"),

    path("deleteUser/", deleteUser, name="delete_user"),
    path("getUserInfo/", getUserInfo, name="getUserInfo"),  
    path("setUserInfo/", setUserInfo, name="setUserInfo"),  
    path("uploadPAFile/", uploadPhotoacousticFile, name="uploadPAFile"),
    path("getPAFiles/", getUserPhotoacousticFiles, name="getPAFiles"),
    path("deletePAFile/", deletePhotoacousticFile, name="deletePAFile"),
    path("calculateHeartrate/", calculateHeartrate, name="calculateHeartrate"),
    path('admin/', admin.site.urls),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
