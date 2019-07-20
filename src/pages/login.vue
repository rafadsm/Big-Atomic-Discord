<template>
  <b-container>
    <b-row class="margem">
      <b-col md="12">
        <b-form  @submit.stop.prevent="formSubmit">

          <b-form-group
            label="Login Settings"
            label-for="input-1"
            description="Cuidado ao exibir este código para alguem!"
          >
            <b-form-input
              id="input-1"
              v-model="token"
              type="text"
              required
              placeholder="Insira o TOKEN do seu BOT"
            ></b-form-input>
          </b-form-group>


          <b-button type="submit" variant="primary">submit</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        token: ''
      }
    },
    methods:
    {
      ...mapActions({
            Login: 'FetchData'
        }),
      formSubmit()
      {
        var self = this;
        var ret = false;
        this.$store.dispatch('FetchData', this.token).then((result)=>{
          if(result)
          {
            if(result.error == 0)
            {
              this.$router.push("home")
            }
            else
            alert('Falha ao logar')
          }
          else
          alert('Falha ao logar')
        }).catch((ex)=>alert('Falha ao logar'))
        
      }
    },
    computed:
    {
      ...mapGetters(['Logged'])
    }
  }
</script>

<style lang="scss">
.margem
{
  margin-top: 10%;
}
</style>
