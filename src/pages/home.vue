<template>
<div>

<b-container>
  <!--b-alert show variant="success">
    <h4 class="alert-heading">Well done!</h4>
    <p>
      Aww yeah, you successfully read this important alert message. This example text is going to
      run a bit longer so that you can see how spacing within an alert works with this kind of
      content.
    </p>
    <hr>
    <p class="mb-0">
      Whenever you need to, be sure to use margin utilities to keep things nice and tidy.
    </p>
  </b-alert-->
  <b-row>
    <h4 class="alert-heading">Selecione o Canal</h4>
  </b-row>

  <b-row>
  <select class="custom-select" size="10" v-model="id">
    <option v-for="cn in GetAllChannels" :key="cn.id" :value="cn.id">{{cn.name}}</option>
  </select>
  </b-row>
  <br>
    <b-row>

      <b-col sm="10">

        <b-form-textarea
      id="textarea"
      v-model="txtMessage"
      placeholder="Digite a mensagem"
      rows="3"></b-form-textarea>
      </b-col>

    </b-row>
  <br>

  <b-row>
    <b-form-radio-group
        id="btn-radios-2"
        v-model="selected"
        :options="options"
        buttons
        button-variant="outline-primary"
        name="radio-btn-outline"
      ></b-form-radio-group>
  </b-row>

  <br>
    <b-row>
      
      <b-col>
        <b-button variant="primary" @click="SendMessage()">Enviar</b-button>
      </b-col>
    </b-row>
    
</b-container>
    <!--div v-for="c in GetAllChannels" :key="c.id">
        {{c.name}}
    </div-->
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
    export default {
        data()
        {
          return{
            txtMessage: '',
            id: 0,
            selected: 0,
            options: [
              { text: 'Comum', value: 0},
              { text: 'Like', value: 1 },
              { text: 'Vote', value: 2 }
            ]
          }
        },
        computed:
        {
            ...mapGetters([
                'GetAllChannels',
                'GetAllUsers',
                'GetToken',
                'Logged'
            ])
        },

        methods:
        {
          SendMessage()
          {
            if(this.txtMessage.length == 0)
              return;

                this.$http.post('https://finn-discord.herokuapp.com/send', {token: this.GetToken, type: this.selected, channel: this.id, message: this.txtMessage})
                this.txtMessage = ""
          }
        },
        mounted()
        {

        }
    }
</script>

<style lang="scss">

</style>