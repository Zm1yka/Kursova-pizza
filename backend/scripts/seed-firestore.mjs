import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import admin from 'firebase-admin'

/**
 * Firestore seed script for the course project.
 *
 * Writes initial documents into collections: `pizzas`, `toppings`
 *
 * How to run:
 * 1) Download a service account key JSON from Firebase Console:
 *    Project settings → Service accounts → Generate new private key
 * 2) Save it as `serviceAccountKey.json` in the project root (it is gitignored)
 * 3) Run: npm run seed
 */

const ROOT = path.resolve(process.cwd(), '..') // Корінь проекту (на рівень вище backend/)
const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT
  ? path.resolve(ROOT, process.env.FIREBASE_SERVICE_ACCOUNT)
  : path.resolve(ROOT, 'serviceAccountKey.json')

// Helper to get absolute path for local images (тепер в frontend/public/)
function getImagePath(relativePath) {
  // Якщо шлях починається з tmp/, додаємо frontend/public/
  if (relativePath.startsWith('tmp/')) {
    return path.resolve(ROOT, 'frontend', 'public', relativePath)
  }
  return path.resolve(ROOT, relativePath)
}

if (!fs.existsSync(keyPath)) {
  console.error(`\n[seed] Service account key not found: ${keyPath}`)
  console.error('[seed] Put the JSON file there OR set FIREBASE_SERVICE_ACCOUNT to its path.\n')
  process.exit(1)
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'webkursova-65b9c.firebasestorage.app',
})

const db = admin.firestore()
const bucket = admin.storage().bucket()

/**
 * Upload local image to Firebase Storage and return public URL
 */
async function uploadImageToStorage(localPath, storagePath) {
  try {
    const fullLocalPath = path.resolve(ROOT, localPath)
    if (!fs.existsSync(fullLocalPath)) {
      console.warn(`[seed] Image not found: ${fullLocalPath}, using public path`)
      // Convert tmp/foto/... to /tmp/foto/... for public folder (frontend/public/)
      if (localPath.startsWith('tmp/foto/')) {
        return `/tmp/foto/${path.basename(localPath)}`
      }
      if (localPath.startsWith('tmp/napoi/')) {
        return `/tmp/napoi/${path.basename(localPath)}`
      }
      return localPath.startsWith('/') ? localPath : `/${localPath}`
    }

    // Try to upload to Firebase Storage
    try {
      await bucket.upload(fullLocalPath, {
        destination: `pizzas/${storagePath}`,
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000',
        },
      })

      const file = bucket.file(`pizzas/${storagePath}`)
      await file.makePublic()
      
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/pizzas/${storagePath}`
      console.log(`[seed] ✓ Uploaded ${storagePath} to Firebase Storage`)
      return publicUrl
    } catch (storageError) {
      // If Storage is not configured, use public path as fallback
      console.warn(`[seed] Storage not available, using public path for ${storagePath}`)
      // Copy to public folder and return public URL
      // Determine target directory based on source path
      let publicSubDir = 'tmp/foto'
      if (localPath.startsWith('tmp/napoi/')) {
        publicSubDir = 'tmp/napoi'
      }
      
      const publicDir = path.resolve(ROOT, 'frontend', 'public', publicSubDir)
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }
      const publicPath = path.resolve(publicDir, path.basename(localPath))
      try {
        fs.copyFileSync(fullLocalPath, publicPath)
      } catch (copyError) {
        console.warn(`[seed] Failed to copy ${fullLocalPath} to ${publicPath}:`, copyError.message)
      }
      // Return a path that can be served by the dev server (must start with /)
      return `/${publicSubDir}/${path.basename(localPath)}`
    }
  } catch (error) {
    console.warn(`[seed] Failed to process ${localPath}:`, error.message)
    // Convert tmp/foto/... to /tmp/foto/... for public folder
    if (localPath.startsWith('tmp/foto/')) {
      return `/tmp/foto/${path.basename(localPath)}`
    }
    return localPath.startsWith('/') ? localPath : `/${localPath}`
  }
}

/** @type {Array<{id:string,title:string,description:string,price:number,imageUrl:string,category:'Meat'|'Veggie'|'Spicy'}>} */
const pizzas = [
  {
    id: 'pepperoni-classic',
    title: 'Пепероні Класик',
    description: 'Класична пепероні з моцарелою та фірмовим томатним соусом.',
    price: 219,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza2.jpg',
    category: 'Meat',
    discountPercent: 20, // 20% знижка
  },
  {
    id: 'bbq-chicken',
    title: 'BBQ Курка',
    description: 'Курка, соус BBQ, моцарела, червона цибуля.',
    price: 239,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza22.jpg',
    category: 'Meat',
    discountPercent: 15, // 15% знижка
  },
  {
    id: 'margherita',
    title: 'Маргарита',
    description: 'Томат, моцарела, базилік. Просто та ідеально.',
    price: 179,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza1.jpg',
    category: 'Veggie',
    discountPercent: 25, // 25% знижка
  },
  {
    id: 'veggie-garden',
    title: 'Овочевий Сад',
    description: 'Перець, оливки, гриби та солодка цибуля на тонкому тісті.',
    price: 199,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza69.jpg',
    category: 'Veggie',
  },
  {
    id: 'diavola',
    title: 'Діавола',
    description: 'Гостра салямі, чилі, моцарела, томатний соус.',
    price: 229,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza32.jpg',
    category: 'Spicy',
  },
  {
    id: 'spicy-salami',
    title: 'Пекуча Салямі',
    description: 'Салямі, халапеньйо, чилі-олія та моцарела.',
    price: 249,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza6.jpg',
    category: 'Spicy',
  },
  {
    id: 'quattro-formaggi',
    title: 'Чотири Сири',
    description: 'Моцарела, пармезан, горгонзола та чедер на тонкому тісті.',
    price: 259,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza36.jpg',
    category: 'Veggie',
    discountPercent: 18, // 18% знижка
  },
  {
    id: 'prosciutto-funghi',
    title: 'Прошутто та Гриби',
    description: 'Ніжне прошутто, шампіньйони, моцарела та вершковий соус.',
    price: 279,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza3.jpg',
    category: 'Meat',
  },
  {
    id: 'capricciosa',
    title: 'Капрічоза',
    description: 'Сир, полядвиця, помідори, перець солодкий, печериці свіжі.',
    price: 269,
    imageUrl: 'tmp/foto/КАПРІЧОЗА-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'hawaiian',
    title: 'Гавайська',
    description: 'Шинка та ананас — для тих, хто любить контрасти.',
    price: 249,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza87.jpg',
    category: 'Meat',
  },
  {
    id: 'funghi',
    title: 'Грибна (Funghi)',
    description: 'Шампіньйони, моцарела, зелень та ароматні спеції.',
    price: 219,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza4.jpg',
    category: 'Veggie',
  },
  {
    id: 'meat-lovers',
    title: 'М’ясна Класика',
    description: 'Пепероні, шинка, бекон, моцарела та томатний соус.',
    price: 299,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza27.jpg',
    category: 'Meat',
  },
  {
    id: 'spicy-buffalo',
    title: 'Гостра Buffalo',
    description: 'Курка, гострий соус, цибуля та моцарела.',
    price: 289,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza18.jpg',
    category: 'Spicy',
  },
  {
    id: 'nduja',
    title: 'Ндуя',
    description: 'Італійська гостра ковбаса ндуя, моцарела та томатний соус.',
    price: 309,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza45.jpg',
    category: 'Spicy',
  },
  {
    id: 'pesto-veggie',
    title: 'Песто Овочева',
    description: 'Соус песто, томати, моцарела та сезонні овочі.',
    price: 259,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza26.jpg',
    category: 'Veggie',
  },
  {
    id: 'tuna-onion',
    title: 'Тунець та Цибуля',
    description: 'Тунець, цибуля, моцарела та томатний соус.',
    price: 279,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza17.jpg',
    category: 'Meat',
  },
  {
    id: 'mistreta',
    title: 'Містрета',
    description: 'Сир, сир фета, синя цибуля, в\'ялені томати, оливки.',
    price: 249,
    imageUrl: 'tmp/foto/МІСТРЕТА-754x502.jpg',
    category: 'Veggie',
  },
  {
    id: 'fredo',
    title: 'Фредо',
    description: 'Сир, вершки, шпинат, куряче м\'ясо, артишоки, в\'ялені томати.',
    price: 269,
    imageUrl: 'tmp/foto/ФРЕДО-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'salerno',
    title: 'Салерно',
    description: 'Сир, вершки, сир філадельфія, лосось, авокадо, лимон.',
    price: 319,
    imageUrl: 'tmp/foto/Салерно-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'vegetarian',
    title: 'Вегетаріанська',
    description: 'Сир, вершки, авокадо, оливки, цибуля, соус песто.',
    price: 239,
    imageUrl: 'tmp/foto/Вегетаріанська-754x502.jpg',
    category: 'Veggie',
  },
  {
    id: 'marettina',
    title: 'Маретіна',
    description: 'Сир, соус, анчоуси, чорні оливки, в\'ялені томати.',
    price: 259,
    imageUrl: 'tmp/foto/МАРЕТІНА-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'catania',
    title: 'Піца Катанія',
    description: 'Сир моцарелла, вершки, салямі, печериці свіжі, сир горгонзолла.',
    price: 279,
    imageUrl: 'tmp/foto/КАТАНІЯ-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'carnoso',
    title: 'Карносо',
    description: 'Сир, соус, полядвиця, бекон, курка копчена, яйце.',
    price: 299,
    imageUrl: 'tmp/foto/КАРНОСО-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'itali',
    title: 'Італі',
    description: 'Сир моцарелла, прошуто, помідори чері, рукола, сир пармезан.',
    price: 289,
    imageUrl: 'tmp/foto/ІТАЛІ-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'bianca',
    title: 'Біанка',
    description: 'Піца на білому соусі, сир, полядвиця, помідори, синя цибуля.',
    price: 249,
    imageUrl: 'tmp/foto/БІАНКА-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'bolognese',
    title: 'Болоньєзе',
    description: 'Сир моцарелла, фарш болоньєзе (густий м\'ясний соус з добавкою різних овочів і томату), сир пармезан.',
    price: 279,
    imageUrl: 'tmp/foto/Болоньєзе-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'tonno',
    title: 'Тонно',
    description: 'Соус, сир, тунець, цибуля синя, помідор, каперси.',
    price: 269,
    imageUrl: 'tmp/foto/ТОННО-754x502.jpg',
    category: 'Meat',
  },
  {
    id: 'frutti-di-mare',
    title: 'Фрутті ді маре',
    description: 'Сир, соус, креветки, мідії, кальмари, восьминоги.',
    price: 329,
    imageUrl: 'tmp/foto/ФРУТІ-ДЕ-МАРЕ-754x502.jpg',
    category: 'Meat',
  },
]

/** @type {Array<{id:string,title:string,price:number,imageUrl:string}>} */
const toppings = []

/** @type {Array<{id:string,title:string,description:string,price:number,imageUrl:string,volume?:number}>} */
const drinks = [
  {
    id: 'coca-cola',
    title: 'Coca-Cola',
    description: 'Класична газована напої з унікальним смаком.',
    price: 45,
    imageUrl: 'tmp/napoi/coca cola.png',
    volume: 500,
  },
  {
    id: 'coca-cola-zero',
    title: 'Coca-Cola Zero',
    description: 'Coca-Cola без цукру з нульовою калорійністю.',
    price: 45,
    imageUrl: 'tmp/napoi/coca-cola-zero.jpg',
    volume: 500,
  },
  {
    id: 'sprite',
    title: 'Sprite',
    description: 'Освіжаючий лимонад з лимонно-лаймовим смаком.',
    price: 45,
    imageUrl: 'tmp/napoi/sprite.png',
    volume: 500,
  },
  {
    id: 'fanta',
    title: 'Fanta',
    description: 'Газований напій з апельсиновим смаком.',
    price: 45,
    imageUrl: 'tmp/napoi/fanta.jpg',
    volume: 500,
  },
  {
    id: 'lymonad-klasychnyj',
    title: 'Лимонад класичний',
    description: 'Освіжаючий домашній лимонад з лимоном та м\'ятою.',
    price: 40,
    imageUrl: 'tmp/napoi/lymonad-klasychnyj.png',
    volume: 500,
  },
  {
    id: 'kompot-smorodyna',
    title: 'Компот зі смородини',
    description: 'Домашній компот зі свіжої смородини.',
    price: 35,
    imageUrl: 'tmp/napoi/kompot-smorodyna-1.jpg',
    volume: 500,
  },
  {
    id: 'uzvar',
    title: 'Узвар',
    description: 'Традиційний український напій з сушених фруктів.',
    price: 35,
    imageUrl: 'tmp/napoi/uzvar.jpg',
    volume: 500,
  },
  {
    id: 'voda-gazovana',
    title: 'Вода газована',
    description: 'Освіжаюча газована вода.',
    price: 25,
    imageUrl: 'tmp/napoi/voda-gazovana.png',
    volume: 500,
  },
  {
    id: 'voda-negazovana',
    title: 'Вода негазована',
    description: 'Чиста негазована вода.',
    price: 25,
    imageUrl: 'tmp/napoi/voda-negazovana.png',
    volume: 500,
  },
]

async function main() {
  console.log('[seed] Seeding Firestore collection: pizzas')
  console.log('[seed] Uploading local images to Firebase Storage...')

  // Upload images and update URLs
  const pizzasWithUrls = []
  for (const p of pizzas) {
    let imageUrl = p.imageUrl
    
    // If it's a local path, upload to Storage
    if (imageUrl.startsWith('tmp/foto/') || imageUrl.startsWith('tmp/napoi/')) {
      const fileName = path.basename(imageUrl)
      const storagePath = imageUrl.startsWith('tmp/napoi/') ? `drinks/${fileName}` : fileName
      imageUrl = await uploadImageToStorage(imageUrl, storagePath)
      console.log(`[seed] Uploaded ${p.title}: ${imageUrl}`)
    }
    
    pizzasWithUrls.push({ ...p, imageUrl })
  }

  const batch = db.batch()
  for (const p of pizzasWithUrls) {
    const ref = db.collection('pizzas').doc(p.id)
    batch.set(
      ref,
      {
        title: p.title,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        ...(p.discountPercent ? { discountPercent: p.discountPercent } : {}),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
  }
  await batch.commit()

  console.log(`[seed] Done. Upserted ${pizzas.length} pizzas.`)

  if (toppings.length > 0) {
    console.log('[seed] Seeding Firestore collection: toppings')
    const tBatch = db.batch()
    for (const t of toppings) {
      const ref = db.collection('toppings').doc(t.id)
      tBatch.set(
        ref,
        {
          title: t.title,
          price: t.price,
          imageUrl: t.imageUrl,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      )
    }
    await tBatch.commit()
    console.log(`[seed] Done. Upserted ${toppings.length} toppings.`)
  } else {
    console.log('[seed] No toppings to seed.')
  }

  console.log('[seed] Seeding Firestore collection: drinks')
  console.log('[seed] Uploading drink images...')

  // Upload drink images and update URLs
  const drinksWithUrls = []
  for (const d of drinks) {
    let imageUrl = d.imageUrl
    
    // If it's a local path, upload to Storage
    if (imageUrl.startsWith('tmp/napoi/')) {
      const fileName = path.basename(imageUrl)
      const storagePath = `drinks/${fileName}`
      imageUrl = await uploadImageToStorage(imageUrl, storagePath)
      console.log(`[seed] Uploaded ${d.title}: ${imageUrl}`)
    }
    
    drinksWithUrls.push({ ...d, imageUrl })
  }

  const dBatch = db.batch()
  for (const d of drinksWithUrls) {
    const ref = db.collection('drinks').doc(d.id)
    dBatch.set(
      ref,
      {
        title: d.title,
        description: d.description,
        price: d.price,
        imageUrl: d.imageUrl,
        ...(d.volume ? { volume: d.volume } : {}),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
  }
  await dBatch.commit()
  console.log(`[seed] Done. Upserted ${drinks.length} drinks.`)
}

main().catch((e) => {
  console.error('[seed] Failed:', e)
  process.exit(1)
})


