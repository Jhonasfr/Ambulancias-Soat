from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),

    # Organizacion (singleton)
    path('organizacion/', views.OrganizacionView.as_view(), name='organizacion'),

    # Sedes
    path('sedes/', views.SedeView.as_view(), name='sedes'),
    path('sedes/<int:sede_id>/', views.SedeView.as_view(), name='sede-detalle'),

    # Ambulancias
    path('ambulancias/', views.AmbulanciaView.as_view(), name='ambulancias'),
    path('ambulancias/<int:ambulancia_id>/', views.AmbulanciaView.as_view(), name='ambulancia-detalle'),

    # Registros SOAT
    path('soat/', views.RegistroSOATView.as_view(), name='soat-lista'),
    path('soat/<int:registro_id>/', views.RegistroSOATView.as_view(), name='soat-detalle'),
    path('soat/<int:registro_id>/exportar/', views.ExportarSOATView.as_view(), name='soat-exportar'),
]