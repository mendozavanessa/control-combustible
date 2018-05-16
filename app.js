'use strict'
angular.module('logistica.control-combustible', [])
    .controller('LogisticaControlCombustibleController', ['$scope', '$http', '$location', '$bootbox', '$modal', '$auth', 'MaintService',
        function ($scope, $http, $location, $bootbox, $modal, $auth, MaintService) {
            /************************** URLS ***********************/
            let urlOcCombustibleGet = 'logistica/combustible/get_list_oc_combustible/';
            let urlOcDetalleCombustibleGet = 'logistica/combustible/get_list_oc_detalle_combustible/';
            let urlOcCantidadproveedorGet = 'logistica/combustible/get_list_cantidad_proveedor_x_oc_combo/';
            let urlVehiculoGet = 'logistica/combustible/get_list_vehiculo/';
            let urlOcDetalleCombustibleSet = 'logistica/combustible/guardar_oc_detalle_combustible/';
            let urlVehiculoSet = 'logistica/combustible/guardar_vehiculo/';
            let urlDetalleCombustibleSet = 'logistica/combustible/guardar_detalle_combustible/';
            let urlOcComboget = 'logistica/combustible/get_list_oc_combustible_combo/';
            let urlDetalleCombustibleGet = 'logistica/combustible/get_list_detalle_combustible/';
            let urlMetaXOrdenCompraGet = 'logistica/combustible/get_list_meta_x_orden_compra/';
            let urlControlCombustibleDel = 'logistica/combustible/eliminar_control_combustible/';
            let urlOficinaget = 'cpanel/oficina_list/get/';
            let url_control_combustible_imprimir = 'logistica/combustible/reporte/get/';
            let url_control_combustible_anual_imprimir = 'logistica/combustible/reporte_anual/get/';
            let urlVehiculoDetalleGet = 'logistica/combustible/get_list_vehiculo_detalle/';
            let sfecha = new Date().toJSON().slice(0, 10);

            let maint_modal = $scope.maint;
            let open_modal_ok = $scope.openModalOk;
            $scope.frmControlCombustible = {
                ordenescompracombo: [],
                cantidadproveedorcombo: [],
                vehiculocombo: [],
                detallescombustibles: [],
                metaxocs: [],
                cant: 0,
                ing_salida: 0,
                id_detalle_control_combustible: null,
                meta: '',
                nro_oc: 0,
                anio: (new Date()).getFullYear(),
                cant_orden: 0,
                cargar: function () {
                    $scope.frmControlCombustible.getOcCantidadProveedor();
                },
                clear: function () {
                    $scope.frmControlCombustible.id_detalle_control_combustible = null;
                    $scope.frmControlCombustible.ing_vale_usuario = '';
                    $scope.frmControlCombustible.ing_nro_vale = '';
                    $scope.frmControlCombustible.ing_nro_pecosa = '';
                    $scope.frmControlCombustible.ing_salida = 0;
                    $scope.frmControlCombustible.ing_fecha = sfecha;
                },
                getOcCombustible: function () {
                    $scope.maint(urlOcComboget, {'anio': $scope.frmControlCombustible.anio}, function (response) {
                        $scope.frmControlCombustible.ordenescompracombo = [];
                        $scope.frmControlCombustible.ordenescompracombo = !response.data.data ? [] : response.data.data;
                        if ($scope.frmControlCombustible.ordenescompracombo.length > 0) {
                            $scope.frmControlCombustible.ing_orden_compra = $scope.frmControlCombustible.ordenescompracombo[0].nro_oc;
                            $scope.frmControlCombustible.getOcCantidadProveedor();
                        }

                    });
                },
                getMetaXOc: function () {
                    $scope.maint(urlMetaXOrdenCompraGet, {
                        anio: $scope.frmControlCombustible.anio,
                        nro_oc: $scope.frmControlCombustible.nro_oc
                    }, function (response) {
                        $scope.frmControlCombustible.metaxocs = [];
                        $scope.frmControlCombustible.metaxocs = !response.data.data ? [] : response.data.data;
                        $scope.frmControlCombustible.meta = $scope.frmControlCombustible.metaxocs[0].nro_meta + ' - ' + $scope.frmControlCombustible.metaxocs[0].descripcion;
                    });
                },
                getOcCantidadProveedor: function () {
                    $scope.maint(urlOcCantidadproveedorGet, {id_oc_control_combustible: $scope.frmControlCombustible.ing_orden_compra}, function (response) {
                        $scope.frmControlCombustible.cantidadproveedorcombo = [];
                        $scope.frmControlCombustible.cantidadproveedorcombo = !response.data.data ? [] : response.data.data;
                        if ($scope.frmControlCombustible.cantidadproveedorcombo.length > 0) {
                            $scope.frmControlCombustible.ing_grifo = $scope.frmControlCombustible.cantidadproveedorcombo[0].razon_social;
                            $scope.frmControlCombustible.ing_cantidad = $scope.frmControlCombustible.cantidadproveedorcombo[0].cantidad;
                            $scope.frmControlCombustible.ing_fecha_notificacion = $scope.frmControlCombustible.cantidadproveedorcombo[0].fecha_notificacion;
                            $scope.frmControlCombustible.nro_oc = $scope.frmControlCombustible.cantidadproveedorcombo[0].nro_oc;
                        }
                        $scope.frmControlCombustible.cant = parseInt($scope.frmControlCombustible.cantidadproveedorcombo[0].cantidad);
                        $scope.frmControlCombustible.getDetalleCombustible();
                        $scope.frmControlCombustible.getMetaXOc();
                    });
                },
                getVehiculo: function () {
                    $scope.maint(urlVehiculoGet, {}, function (response) {
                        $scope.frmControlCombustible.vehiculocombo = [];
                        $scope.frmControlCombustible.vehiculocombo = !response.data.data ? [] : response.data.data;
                        if ($scope.frmControlCombustible.vehiculocombo.length > 0) {
                            $scope.frmControlCombustible.ing_placa = $scope.frmControlCombustible.vehiculocombo[0].placa_vehiculo;
                        }
                    });
                },
                getDetalleCombustible: function () {
                    $scope.maint(urlDetalleCombustibleGet, {
                        'id_oc_control_combustible': $scope.frmControlCombustible.ing_orden_compra
                    }, function (response) {
                        $scope.frmControlCombustible.detallescombustibles = [];
                        $scope.frmControlCombustible.detallescombustibles = !response.data.data ? [] : response.data.data;
                        $scope.frmControlCombustible.cant = parseInt($scope.frmControlCombustible.ing_cantidad);
                        for (let i = 0; i < $scope.frmControlCombustible.detallescombustibles.length; i++) {
                            $scope.frmControlCombustible.cant = $scope.frmControlCombustible.cant - parseInt($scope.frmControlCombustible.detallescombustibles[i].salida);
                            $scope.frmControlCombustible.detallescombustibles[i]['total'] = $scope.frmControlCombustible.cant;
                        }
                    });
                },
                actualizar: function (item_) {
                    $scope.frmControlCombustible.id_detalle_control_combustible = item_.id_detalle_control_combustible;
                    $scope.frmControlCombustible.ing_vale_usuario = item_.vale_usuario;
                    $scope.frmControlCombustible.ing_nro_vale = item_.nro_vale;
                    $scope.frmControlCombustible.ing_nro_pecosa = item_.nro_pecosa;
                    $scope.frmControlCombustible.ing_salida = item_.salida;
                    $scope.frmControlCombustible.ing_placa = item_.placa_vehiculo;
                    $scope.frmControlCombustible.ing_orden_compra = item_.id_oc_control_combustible;
                    $scope.frmControlCombustible.ing_fecha = item_.fecha;
                },
                set: function () {
                    if ($scope.frmControlCombustible.ing_cantidad >= parseInt($scope.frmControlCombustible.ing_salida)) {
                        $scope.maint(urlDetalleCombustibleSet, {
                            'id_detalle_control_combustible': $scope.frmControlCombustible.id_detalle_control_combustible,
                            'anio': $scope.frmControlCombustible.anio,
                            'vale_usuario': $scope.frmControlCombustible.ing_vale_usuario,
                            'nro_vale': $scope.frmControlCombustible.ing_nro_vale,
                            'nro_pecosa': $scope.frmControlCombustible.ing_nro_pecosa,
                            'salida': $scope.frmControlCombustible.ing_salida,
                            'placa_vehiculo': $scope.frmControlCombustible.ing_placa,
                            'id_oc_control_combustible': $scope.frmControlCombustible.ing_orden_compra,
                            'fecha': $scope.frmControlCombustible.ing_fecha,
                        }, function (response) {
                            $scope.frmControlCombustible.getDetalleCombustible();
                            $scope.frmControlCombustible.clear();
                        })
                    }
                },
                del: function (indice) {
                    $scope.maint(urlControlCombustibleDel, {
                        'id_detalle_control_combustible': $scope.frmControlCombustible.detallescombustibles[indice].id_detalle_control_combustible
                    }, function (response) {
                        $scope.frmControlCombustible.getDetalleCombustible();
                    })
                },
                imprimirRequerimiento: function () {
                    let parametros = {
                        "anio": $scope.frmControlCombustible.anio,
                        "nro_oc": $scope.frmControlCombustible.ing_orden_compra,
                        'id_oc_control_combustible': $scope.frmControlCombustible.ing_orden_compra
                    };
                    $scope.maint(url_control_combustible_imprimir, parametros,
                        function (response) {
                            let resp = response.data.data;
                            if (resp.length != 0) {
                                let url_base = 'logistica/assets/pdf/';
                                let name = resp[0].name;
                                let url = url_base + name;
                                let myWindow = window.open(url, "MsgWindow", "width=600, height=400");
                            }
                        },
                        function (callError) {
                            $scope.openModalOk(callError.data.msg);
                        }, 'r');
                },
            };
            $scope.frmControlCombustible.getOcCombustible();
            $scope.frmControlCombustible.getVehiculo();
            $scope.frmControlCombustible.ing_fecha = sfecha;
            $scope.abrirNuevoOc = function () {
                openAddModalNuevoOc();
            };
            $scope.abrirNuevoVehiculo = function () {
                openAddModalNuevoVehiculo();
            };
            $scope.openAddModalNuevoOc = function () {
                //let datos = $scope.frmControlCombustible.ordenescompra;
                let modalInstance = $modal.open({
                    templateUrl: 'logistica/assets/views/modalCargarOrdenCompra.html',
                    controller: ['$scope', '$modalInstance', 'frmControlCombustible', function ($scope, $modalInstance, frmControlCombustible) {
                        $scope.frmControlCombustible2 = frmControlCombustible;
                        $scope.frmOc_Modal = {
                            ocompras_modal: [],
                            occombustibles_modal: [],
                            anio: (new Date()).getFullYear(),
                            fecha_notificacion: (new Date()).toJSON().slice(0, 10),
                            get_modal_o_compra: function () {
                                maint_modal(urlOcCombustibleGet, {
                                    anio: $scope.frmOc_Modal.anio
                                }, function (response) {
                                    $scope.frmOc_Modal.ocompras_modal = [];
                                    $scope.frmOc_Modal.ocompras_modal = !response.data.data ? [] : response.data.data;
                                    if ($scope.frmOc_Modal.ocompras_modal.length > 0) {
                                        $scope.frmOc_Modal.nro_oc = $scope.frmOc_Modal.ocompras_modal[0].nro_oc;
                                    }
                                });
                            },
                            get_modal_oc_detalle_combustible: function () {
                                maint_modal(urlOcDetalleCombustibleGet, {
                                    anio: $scope.frmOc_Modal.anio,
                                    nro_oc: $scope.frmOc_Modal.nro_oc
                                }, function (response) {
                                    $scope.frmOc_Modal.occombustibles_modal = [];
                                    $scope.frmOc_Modal.occombustibles_modal = !response.data.data ? [] : response.data.data;
                                });
                            },
                            saveOcControlCombustible: function (indice) {
                                maint_modal(urlOcDetalleCombustibleSet, {
                                        'anio': $scope.frmOc_Modal.occombustibles_modal[indice].anio,
                                        'tipo': $scope.frmOc_Modal.occombustibles_modal[indice].tipo,
                                        'nro_oc': $scope.frmOc_Modal.occombustibles_modal[indice].nro_oc,
                                        'ruc': $scope.frmOc_Modal.occombustibles_modal[indice].ruc,
                                        'razon_social': $scope.frmOc_Modal.occombustibles_modal[indice].razon_social,
                                        'id_catalogo_bien_servicio': $scope.frmOc_Modal.occombustibles_modal[indice].id_catalogo_bien_servicio,
                                        'cantidad': $scope.frmOc_Modal.occombustibles_modal[indice].cantidad,
                                        'abreviatura': $scope.frmOc_Modal.occombustibles_modal[indice].abreviatura,
                                        'fecha_notificacion': $scope.frmOc_Modal.fecha_notificacion,
                                        'descripcion': $scope.frmOc_Modal.occombustibles_modal[indice].descripcion
                                    },
                                    function (reponse) {
                                        $scope.frmControlCombustible2.getOcCombustible();
                                        $scope.frmOc_Modal.get_modal_oc_detalle_combustible();
                                    })
                            }
                        };
                        $scope.frmOc_Modal.get_modal_o_compra();
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }],
                    size: 'lg',
                    resolve: {
                        frmControlCombustible: function () {
                            return $scope.frmControlCombustible;
                        }
                    }
                });
            };
            $scope.openAddModalReporte = function () {
                let modalInstance = $modal.open({
                    templateUrl: 'logistica/assets/views/modalBienesCombustible.html',
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                        let url_lista_bienes = 'logistica/combustible/get_list_bienes_combustible/';
                        $scope.frmModal = {
                            bienes_modal: [],
                            descripcion: '',
                            anio: (new Date()).getFullYear(),
                            id_catalogo_bien_servicio: '',
                            get_modal_bienes_lista: function () {
                                maint_modal(url_lista_bienes, {'anio': $scope.frmModal.anio}, function (response) {
                                    $scope.frmModal.bienes_modal = [];
                                    $scope.frmModal.bienes_modal = !response.data.data ? [] : response.data.data;
                                    if ($scope.frmModal.bienes_modal.length > 0) {
                                        $scope.frmModal.id_catalogo_bien_servicio = $scope.frmModal.bienes_modal[0].id_catalogo_bien_servicio;
                                    }
                                });
                            },
                            imprimirControlCombustibleAnual: function () {
                                let parametros = {
                                    "anio": $scope.frmModal.anio,
                                    "id_catalogo_bien_servicio": $scope.frmModal.id_catalogo_bien_servicio,
                                };
                                maint_modal(url_control_combustible_anual_imprimir, parametros,
                                    function (response) {
                                        let resp = response.data.data;
                                        if (resp.length != 0) {
                                            let url_base = 'logistica/assets/pdf/';
                                            let name = resp[0].name;
                                            let url = url_base + name;
                                            let myWindow = window.open(url, "MsgWindow", "width=600, height=400");
                                        }
                                    },
                                    function (callError) {
                                        open_modal_ok(callError.data.msg);
                                    }, 'r');
                            }
                        };
                        $scope.frmModal.get_modal_bienes_lista();
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }],
                    size: 'md',
                    resolve: {
                        frmControlCombustible: function () {
                            return $scope.frmControlCombustible;
                        }
                    }
                });
            };
            $scope.openAddModalNuevoVehiculo = function () {
                //let datos = $scope.frmControlCombustible.ordenescompra;
                let modalInstance = $modal.open({
                    templateUrl: 'logistica/assets/views/modalVehiculo.html',
                    controller: ['$scope', '$modalInstance', 'frmControlCombustible', function ($scope, $modalInstance, frmControlCombustible) {
                        $scope.frmControlCombustible = frmControlCombustible;
                        $scope.tipocombustible = [
                            {value: 1, text: 'PETROLEO'},
                            {value: 2, text: 'GASOLINA'},
                            {value: 3, text: 'GAS'}
                        ];
                        $scope.tipovehiculo = [
                            {value: 1, text: 'S/T'},
                            {value: 2, text: 'CAMIONETA'},
                            {value: 3, text: 'CAMION'},
                            {value: 4, text: 'AUTOMOVIL'},
                            {value: 5, text: 'AUTOBUS'},
                            {value: 6, text: 'MICROBUS'},
                            {value: 7, text: 'MOTOCICLETA'},
                            {value: 8, text: 'REMOLQUE'},
                            {value: 9, text: 'VOLQUETA'},
                            {value: 10, text: 'CUATRIMOTO'},
                            {value: 11, text: 'CAMPERO'},
                            {value: 12, text: 'TRACTO-CAMION'},
                            {value: 13, text: 'FURGON'},
                            {value: 14, text: 'CISTERNA'},
                            {value: 15, text: 'EQUIPOS MENORES'},
                            {value: 16, text: 'CAMIONETA COMBI'},
                            {value: 17, text: 'CAMION BARANDA'},
                            {value: 18, text: 'CAMION CISTERNA DE AGUA'},
                            {value: 19, text: 'CAMION CISTERNA DE COMBUSTIBLE'},
                            {value: 20, text: 'CAMION PLATAFORMA'},
                            {value: 21, text: 'CAMION TAMQUE IMPRIMADOR'},
                            {value: 22, text: 'CAMION VOLQUETE'},
                            {value: 23, text: 'CARGADOR FRONTAL'},
                            {value: 24, text: 'CHANCADORA DE PIEDRA PRIMARIA'},
                            {value: 25, text: 'CHANCADORA DE PIEDRA SECUNDARIA'},
                            {value: 26, text: 'COMPRESORA DE AIRE'},
                            {value: 27, text: 'ESPARCIDORA DE ASFALTO'},
                            {value: 28, text: 'EXCAVADORA HIDRAULICA'},
                            {value: 29, text: 'MOTONIVELADORA'},
                            {value: 30, text: 'PLANTA DE ASFALTO'},
                            {value: 31, text: 'RODILLO NEUMATICO'},
                            {value: 32, text: 'RODILLO TANDEM'},
                            {value: 33, text: 'RODILLO VIBRATORIO'},
                            {value: 34, text: 'SELECCIONADORA DE ARIDOS'},
                            {value: 35, text: 'TRACTOR CAMION'},
                            {value: 36, text: 'PLATAFORMA CAMA BAJA'},
                            {value: 37, text: 'TRACTOR NEUMATICO'},
                            {value: 38, text: 'TRACTOR SOBRE ORUGAS'},
                        ];
                        $scope.frmvehiculo_Modal = {
                            oficinas_modal: [],
                            vehiculos_modal: [],
                            ing_marca: '',
                            ing_modelo: '',
                            ing_tipo_combustible: 'PETROLEO',
                            ing_tipo_vehiculo: 'S/T',
                            ing_id_vehiculo: null,
                            ing_serie_chasis: '',
                            ing_marca_motor: '',
                            ing_kilometraje_motor: '',
                            ing_serie_motor: '',
                            ing_annio_fabricacion: '',
                            ing_nro_orden_trabajo: '',
                            ing_modelo_motor: '',
                            filtro: '',
                            vehiculodetalles: [],
                            currentVehiculos: [],
                            currentPage: 1,
                            get_modal_Vehiculo_Detalle: function () {
                                maint_modal(urlVehiculoDetalleGet, {'filtro': $scope.frmvehiculo_Modal.filtro}, function (response) {
                                    $scope.frmvehiculo_Modal.vehiculodetalles = [];
                                    $scope.frmvehiculo_Modal.vehiculodetalles = !response.data.data ? [] : response.data.data;
                                    $scope.frmvehiculo_Modal.pageChanged();
                                });
                            },
                            get_modal_oficinas: function () {
                                maint_modal(urlOficinaget, {}, function (response) {
                                    $scope.frmvehiculo_Modal.oficinas_modal = [];
                                    $scope.frmvehiculo_Modal.oficinas_modal = !response.data.data ? [] : response.data.data;
                                    if ($scope.frmvehiculo_Modal.oficinas_modal.length > 0) {
                                        $scope.frmvehiculo_Modal.ing_oficina = $scope.frmvehiculo_Modal.oficinas_modal[0].abreviatura;
                                        $scope.frmvehiculo_Modal.ing_tipo_combustible = $scope.tipocombustible[0].text;
                                    }
                                });
                            },
                            get_modal_vehiculos: function () {
                                maint_modal(urlVehiculoGet, {}, function (response) {
                                    $scope.frmvehiculo_Modal.vehiculos_modal = [];
                                    $scope.frmvehiculo_Modal.vehiculos_modal = !response.data.data ? [] : response.data.data;
                                    $scope.frmControlCombustible.getVehiculo();
                                });
                            },
                            clear: function () {
                                $scope.frmvehiculo_Modal.ing_id_vehiculo = null;
                                $scope.frmvehiculo_Modal.ing_placa_vehiculo = '';
                                $scope.frmvehiculo_Modal.ing_marca = '';
                                $scope.frmvehiculo_Modal.ing_modelo = '';
                                $scope.frmvehiculo_Modal.ing_serie_chasis = '';
                                $scope.frmvehiculo_Modal.ing_marca_motor = '';
                                $scope.frmvehiculo_Modal.ing_kilometraje_motor = '';
                                $scope.frmvehiculo_Modal.ing_serie_motor = '';
                                $scope.frmvehiculo_Modal.ing_annio_fabricacion = '';
                                $scope.frmvehiculo_Modal.ing_modelo_motor = '';
                            },
                            actualizar: function (indice) {
                                $scope.frmvehiculo_Modal.ing_id_vehiculo = $scope.frmvehiculo_Modal.vehiculodetalles[indice].id_vehiculo;
                                $scope.frmvehiculo_Modal.ing_placa_vehiculo = $scope.frmvehiculo_Modal.vehiculodetalles[indice].placa_vehiculo;
                                $scope.frmvehiculo_Modal.ing_tipo_vehiculo = $scope.frmvehiculo_Modal.vehiculodetalles[indice].tipo_vehiculo;
                                $scope.frmvehiculo_Modal.ing_marca = $scope.frmvehiculo_Modal.vehiculodetalles[indice].marca;
                                $scope.frmvehiculo_Modal.ing_modelo = $scope.frmvehiculo_Modal.vehiculodetalles[indice].modelo;
                                $scope.frmvehiculo_Modal.ing_tipo_combustible = $scope.frmvehiculo_Modal.vehiculodetalles[indice].tipo_combustible;
                                $scope.frmvehiculo_Modal.ing_oficina = $scope.frmvehiculo_Modal.vehiculodetalles[indice].abreviatura_oficina;
                                $scope.frmvehiculo_Modal.ing_serie_chasis = $scope.frmvehiculo_Modal.vehiculodetalles[indice].serie_chasis;
                                $scope.frmvehiculo_Modal.ing_marca_motor = $scope.frmvehiculo_Modal.vehiculodetalles[indice].marca_motor;
                                $scope.frmvehiculo_Modal.ing_modelo_motor = $scope.frmvehiculo_Modal.vehiculodetalles[indice].modelo_motor;
                                $scope.frmvehiculo_Modal.ing_serie_motor = $scope.frmvehiculo_Modal.vehiculodetalles[indice].serie_motor;
                                $scope.frmvehiculo_Modal.ing_annio_fabricacion = $scope.frmvehiculo_Modal.vehiculodetalles[indice].anio_fabricacion;
                            },
                            saveVehiculo: function () {
                                maint_modal(urlVehiculoSet, {
                                        'id_vehiculo': $scope.frmvehiculo_Modal.ing_id_vehiculo,
                                        'placa_vehiculo': $scope.frmvehiculo_Modal.ing_placa_vehiculo,
                                        'tipo_vehiculo': $scope.frmvehiculo_Modal.ing_tipo_vehiculo,
                                        'marca': $scope.frmvehiculo_Modal.ing_marca,
                                        'modelo': $scope.frmvehiculo_Modal.ing_modelo,
                                        'tipo_combustible': $scope.frmvehiculo_Modal.ing_tipo_combustible,
                                        'abreviatura_oficina': $scope.frmvehiculo_Modal.ing_oficina,
                                        'serie_chasis': $scope.frmvehiculo_Modal.ing_serie_chasis,
                                        'marca_motor': $scope.frmvehiculo_Modal.ing_marca_motor,
                                        'modelo_motor': $scope.frmvehiculo_Modal.ing_modelo_motor,
                                        'serie_motor': $scope.frmvehiculo_Modal.ing_serie_motor,
                                        'anio_fabricacion': $scope.frmvehiculo_Modal.ing_annio_fabricacion
                                    },
                                    function (reponse) {
                                        $scope.frmvehiculo_Modal.get_modal_vehiculos();
                                        $scope.frmvehiculo_Modal.clear();
                                    });
                            },
                            pageChanged: function () {
                                $scope.frmvehiculo_Modal.currentVehiculos = [];
                                let array = $scope.frmvehiculo_Modal.vehiculodetalles;
                                let index = $scope.frmvehiculo_Modal.currentPage;
                                let a = (index - 1) * 10;
                                let b = a + 10 > array.length ? array.length : a + 10;
                                $scope.frmvehiculo_Modal.currentVehiculos = array.slice(a, b);
                            }
                        };
                        $scope.frmvehiculo_Modal.get_modal_oficinas();
                        $scope.frmvehiculo_Modal.get_modal_vehiculos();
                        $scope.frmvehiculo_Modal.get_modal_Vehiculo_Detalle();
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }],
                    size: 'lg',
                    resolve: {
                        frmControlCombustible: function () {
                            return $scope.frmControlCombustible;
                        }
                    }
                });
            };
            let openAddModalNuevoOc = $scope.openAddModalNuevoOc;
            let openAddModalNuevoVehiculo = $scope.openAddModalNuevoVehiculo;
        }
    ]);
