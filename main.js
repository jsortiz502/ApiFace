
const API="?fields=id%2Cname%2Cpicture&access_token=EAAbZCcMlbW44BAMF6oLDqGZCmWWfueRpuHk4zAO5noFpw1iZC21nULg9eBAzsM6gZABckvPHdTbujXclrDfZCzOWHtWwGioQx3nSrzmBCMTqwFjFGflPhH3M6hZA1QkhdZBxAeokZCZC0gKt9ZCva66zOMnSr2YgTMTIzjz1ooxA0P0cIvHeInPqiyWX7p2r56iTscgn8xzq8OVSXmZABQomtoa97bs9xp45rPgZBUsvF9VYh2eyhz7R0XmjlOa4P9gMXa0ZD"
const fa="https://graph.facebook.com/v14.0/"
console.log(API)

const app = Vue.createApp({
    data() {                //SE agregan los atributos
      return {
        busqueda: null,
        resultado: null,//un vacio o no hay nada
        fail: null,
        favoritos: new Map()//aqui se guarda o almacenara las busquedas favoritas o que seran agregadas
      }   
    },
    //No se requiere acceso al DOM, solo al localStorage
    created() {
      //Con getItem se obtiene informacion del localStorage
      const favoritosGuardados = JSON.parse(window.localStorage.getItem("favoritos"))
      console.log(favoritosGuardados)
      //Esta condicion solo se cumple si se añadieron los favoritos
      if(favoritosGuardados && favoritosGuardados.length) {//Se evalua que haya algo adentro de los favoritosGuardados
          const favoritosRebuild = new Map(favoritosGuardados.map(alias=>[alias.id, alias]));//El map se componer de una llave y un valor
        /* En favoritos guardados.map se obtiene*/
      this.favoritos = favoritosRebuild
      console.log(this.favoritos)
        }
      },
    computed: {
        esFavorito(){
          return this.favoritos.has(this.resultado.id)
        },

        allFavoritos(){
          return Array.from(this.favoritos.values())
        }
    },
    methods: {
        async Buscar(){
          try{
            const response = await fetch(fa + this.busqueda + API )
            //Si ok es false, 
            if(!response.ok) throw ("El usuario no existe")
            const data = await response.json()
            console.log(data)           
            this.resultado = data
            this.fail = null
            
          } catch (error) {
            this.fail = error
            this.resultado = false

          }finally{
            //finalmente hacer que la busqueda quede vacia
            this.busqueda = null
            
          }
            
        },
      addFavorito(){
        //la clave de este map es el 'id' y su valor es el 'resultado'
        this.favoritos.set(this.resultado.id, this.resultado)
        this.updateFavorito()
      },
      //Aqui se eliminan los que se hayan añadido como favoritos
      removeFavorito(){
        this.favoritos.delete(this.resultado.id)
        this.updateFavorito()
      },
      //guardar en cache los usuarios añadidos como favoritos
      //de manera persistente
      updateFavorito(){
        window.localStorage.setItem('favoritos',JSON.stringify(this.allFavoritos))
      },
      //Al dar click en la foto vuelva a mostrar la informacion del usuario, debajo de la barra de busqueda
      mostrarFavorito(parametro){

        this.resultado = parametro
      }
    }
  })