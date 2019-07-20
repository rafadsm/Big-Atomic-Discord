<template>
<div>
<b-container>

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

      <b-col sm="12">

        <b-form-textarea
      id="textarea"
      v-model="txtMessage"
      placeholder="Digite a mensagem"
      rows="3"></b-form-textarea>
      </b-col>

    </b-row>
  <br>

  <b-row>
    <b-col sm="12">
    <b-form-radio-group
        id="btn-radios-2"
        v-model="selected"
        :options="options"
        buttons
        button-variant="outline-primary"
        name="radio-btn-outline"
      ></b-form-radio-group>
        <b-button variant="primary" @click="SendMessage()" class="float-right">Enviar</b-button>
    </b-col>
  </b-row>

  <br>

    <b-row>
    <h4 class="alert-heading">Lista de Usuários</h4>
  </b-row>

  <b-row>
      <b-col md="8" class="my-1">
        <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
  </b-row>
  <br>
    <b-row>
      <b-table
      show-empty
      stacked="md"
      :items="GetAllUsers"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered">

    <template slot="display" slot-scope="row">
        {{ row.item.display }}
    </template>
    <template slot="username" slot-scope="row">
        @{{ row.value }}#{{row.item.tag}}
    </template>
    <template slot="id" slot-scope="row">
        <@{{ row.value }}>
    </template>

    </b-table>
    </b-row>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
    
</b-container>

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
            ],

            fields: [
              { key: 'display', label: 'Display Name'},
              { key: 'username', label: 'TAG'},
              { key: 'id', label: 'Mention'}
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: 20,
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
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
          onFiltered(filteredItems) {
          this.totalRows = filteredItems.length
          this.currentPage = 1
        },

          SendMessage()
          {
            if(this.txtMessage.length == 0)
              return;

                this.$http.post('http://localhost:8080/send', {token: this.GetToken, type: this.selected, channel: this.id, message: this.txtMessage})
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