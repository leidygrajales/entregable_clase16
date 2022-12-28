
import knex from 'knex';

class ContainerSQL {

  constructor(options, table) {
    this.connection = knex(options)
    this.table = table
  }

  async save(obj) {
    try {
      const [insert] = await this.connection.insert(obj).into(this.table)
      return { id: insert }
    } catch (e) {
      console.log(e)
    }
  }

  async getAll() {
    try {
      const data = await this.connection(this.table).select('*')
      return data
    } catch (e) {
      console.log(e)
    }
  }

  async getById(id) {
    try {
      const obj = await this.connection(this.table).select('*').where('id', '=', id).first()
      if (!obj) {
        return { error: 'elemento no encontrado' }
      }
      return obj
    } catch (e) {
      console.log(e)
    }
  }

  async deleteById(id) {
    try {
      const result_id = await this.connection(this.table).where('id', '=', id).del()
      return { deleted_id: result_id }
    } catch (e) {
      console.log(e)
    }
  }

  async deleteAll() {
    try {
      const result = await this.connection(this.table).del()
      return { success: true }
    } catch (e) {
      console.log(e)
    }
  }

  async updateById(id, obj) {
    try {
      const result_id = await this.connection(this.table).where('id', '=', id).update(obj)
      return { updated_id: result_id }
    } catch (e) {
      console.log(e)
    }
  }

  async getRandom() {
    const data = await this.connection(this.table).select('*')
    const random = Math.floor(Math.random() * data.length)

    return data[random] || {}
  }
}

export default ContainerSQL
