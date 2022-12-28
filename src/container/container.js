import fs from 'fs/promises'

class Container {
  constructor(path) {
    this.path = path
  }

  async save(obj) {
    try {
      const reader = await fs.readFile(this.path, 'utf-8')
      const data = JSON.parse(reader)
      const id = data.length === 0 ? 1 : data[data.length - 1].id + 1
      const timestamp = Date.now()
      const newItem = { id, timestamp, ...obj }
      data.push(newItem)
      await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8')
      return { id: newItem.id }
    } catch (e) {
      console.log(e)
    }
  }

  async getAll() {
    try {
      const reader = await fs.readFile(this.path, 'utf-8')
      const data = JSON.parse(reader)
      return data
    } catch (e) {
      console.log(e)
    }
  }

  async getById(id) {
    try {
      const reader = await fs.readFile(this.path, 'utf-8')
      const data = JSON.parse(reader)
      const obj = data.find((obj) => obj.id == id)
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
      const reader = await fs.readFile(this.path, 'utf-8')
      const data = JSON.parse(reader)
      const filteredData = data.filter((obj) => obj.id != id)

      await fs.writeFile(this.path, JSON.stringify(filteredData, null, 2), 'utf-8')

      return { deleted_id: id }
    } catch (e) {
      console.log(e)
    }
  }

  async deleteAll() {
    try {
      await fs.writeFile(this.path, JSON.stringify([], null, 2), 'utf-8')
      return { success: true }
    } catch (e) {
      console.log(e)
    }
  }

  async updateById(id, obj) {
    try {
      const reader = await fs.readFile(this.path, 'utf-8')
      const data = JSON.parse(reader)
      const updatedData = data.map((find_obj) =>
        find_obj.id == id ? { ...find_obj, ...obj } : find_obj
      )

      await fs.writeFile(this.path, JSON.stringify(updatedData, null, 2), 'utf-8')
      return { updated_id: id }
    } catch (e) {
      console.log(e)
    }
  }

  async getRandom() {
    const reader = await fs.readFile(this.path, 'utf-8')
    const data = JSON.parse(reader)

    const random = Math.floor(Math.random() * data.length)

    return data[random] || {}
  }
}

export default Container
