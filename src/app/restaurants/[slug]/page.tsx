"use client";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface RestaurantApi { _id: string; name: string; imageUrl: string; categories: string[] }
interface CustomizationOption { name: string; price: number }
interface Customization { name: string; required: boolean; options: CustomizationOption[] }
interface ItemApi { _id: string; name: string; imageUrl: string; price: number; isFeatured: boolean; category: string; restaurant: string; customizations?: Customization[] }

interface Params { params: { slug: string } }

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function RestaurantPage({ params }: Params) {
  const { add } = useCart()
  const { slug } = params
  const [restaurant, setRestaurant] = useState<RestaurantApi | null>(null)
  const [items, setItems] = useState<ItemApi[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogItem, setDialogItem] = useState<ItemApi | null>(null)
  // For each group: selected option name or null
  const [selected, setSelected] = useState<Record<string, string | null>>({})
  // For optional groups: whether enabled; required groups are implicitly enabled
  const [enabled, setEnabled] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL
        if (!base) throw new Error('Missing NEXT_PUBLIC_API_URL')
        // fetch all restaurants then resolve slug -> id (could add dedicated endpoint later)
        const restRes = await fetch(`${base}/restaurant`, { cache: 'no-store' })
        if (!restRes.ok) throw new Error('Failed to fetch restaurants')
        const restData = await restRes.json()
        const list: RestaurantApi[] = Array.isArray(restData.restaurants) ? restData.restaurants : []
        const match = list.find(r => slugify(r.name) === slug)
        if (!match) { if (active) setError('Restaurant not found'); return }
        if (active) setRestaurant(match)
        // fetch items by restaurant id
        const itemsRes = await fetch(`${base}/items/restaurant/${match._id}`, { cache: 'no-store' })
        if (!itemsRes.ok) throw new Error('Failed to fetch items')
        const itemsData = await itemsRes.json()
        const itemsList: ItemApi[] = Array.isArray(itemsData.items) ? itemsData.items : []
        if (active) {
          setItems(itemsList)
          if (itemsList.length > 0 && !activeCategory) {
            const firstCat = itemsList[0].category
            setActiveCategory(firstCat)
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load restaurant'
        if (active) setError(msg)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [slug, activeCategory])

  if (!loading && error === 'Restaurant not found') {
    notFound()
  }

  const categories = Array.from(new Set(items.map(i => i.category)))
  const featured = items.filter(i => i.isFeatured).slice(0, 8)
  const activeItems = items.filter(i => i.category === activeCategory)

  function openAdd(item: ItemApi) {
    const sel: Record<string, string | null> = {}
    const en: Record<string, boolean> = {}
    ;(item.customizations || []).forEach(g => {
      sel[g.name] = null
      if (!g.required) en[g.name] = false
    })
    setSelected(sel)
    setEnabled(en)
    setDialogItem(item)
  }
  function setOptionalEnabled(group: string, on: boolean) {
    setEnabled(prev => ({ ...prev, [group]: on }))
    if (!on) setSelected(prev => ({ ...prev, [group]: null }))
  }
  function chooseOption(group: string, optionName: string) {
    setSelected(prev => ({ ...prev, [group]: optionName }))
  }
  function confirmAdd() {
    if (!dialogItem) return
    const groups = dialogItem.customizations || []
    for (const g of groups) {
      if (g.required) {
        const sel = selected[g.name]
        if (!sel) {
          alert(`Please select one option for ${g.name}`)
          return
        }
      }
    }
    const selectedOptions = groups.map(g => {
      const selName = selected[g.name]
      const isEnabled = g.required || enabled[g.name]
      if (!isEnabled || !selName) return null
      const opt = g.options.find(o => o.name === selName)
      if (!opt) return null
      return { group: g.name, options: [opt] }
    }).filter(Boolean) as { group: string; options: { name: string; price: number }[] }[]
    const variantKey = selectedOptions.map(g => `${g.group}:${g.options.map(o=>o.name).sort().join('|')}`).sort().join(';')
    add({ id: dialogItem._id, name: dialogItem.name, price: dialogItem.price, image: dialogItem.imageUrl, restaurantId: restaurant?._id, selectedOptions, qty: 1, variantKey })
    setDialogItem(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/restaurants" className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{restaurant ? restaurant.name : (loading ? 'Loading…' : 'Not found')}</h1>
            </div>
          </div>
        </div>
      </div>
      <section className="relative py-12">
        <div className="container">
          {loading && (
            <div className="text-center text-sm text-muted-foreground py-20">Loading restaurant…</div>
          )}
          {!loading && error && error !== 'Restaurant not found' && (
            <div className="text-center text-sm text-red-500 py-20">{error}</div>
          )}
          {!loading && !error && restaurant && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="hidden">
                <div className="sticky top-4">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-48">
                      <SafeImage
                        src={restaurant.imageUrl || '/placeholder.jpg'}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">Categories: {restaurant.categories.length}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Items</span>
                          <span className="font-medium">{items.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                {featured.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-6">Featured Items</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                      {featured.map(f => (
                        <div
                          key={f._id}
                          className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <SafeImage
                              src={f.imageUrl || '/placeholder.jpg'}
                              alt={f.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <div className="mb-3">
                              <h3 className="font-bold text-sm md:text-base leading-tight mb-1">{f.name}</h3>
                              <p className="text-xs text-muted-foreground">{f.category}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm md:text-lg font-bold text-secondary">Rs. {f.price.toFixed(2)}</span>
                              <Button
                                onClick={() => openAdd(f)}
                                size="sm"
                                variant="default"
                                className="bg-secondary hover:bg-secondary/90 text-white"
                                aria-label={`Add ${f.name} to cart`}
                              >
                                <Plus className="h-4 w-4 mr-2" /> Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Menu Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(c => (
                      <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-full text-sm cursor-pointer font-medium transition-colors ${activeCategory === c ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{c} ({items.filter(i => i.category === c).length})</button>
                    ))}
                  </div>
                </div>
                {activeCategory && (
                  <div>
                    <h3 className="text-xl font-bold mb-6">{activeCategory}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                      {activeItems.map(it => (
                        <div
                          key={it._id}
                          className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <SafeImage
                              src={it.imageUrl || '/placeholder.jpg'}
                              alt={it.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <div className="mb-3">
                              <h4 className="font-bold text-sm md:text-base leading-tight mb-1">{it.name}</h4>
                              <p className="text-xs text-muted-foreground">{it.category}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm md:text-lg font-bold text-secondary">Rs. {it.price.toFixed(2)}</span>
                              <Button
                                onClick={() => openAdd(it)}
                                size="sm"
                                variant="default"
                                className="bg-secondary hover:bg-secondary/90 text-white"
                                aria-label={`Add ${it.name} to cart`}
                              >
                                <Plus className="h-4 w-4 mr-2" /> Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {activeItems.length === 0 && (
                        <div className="text-sm text-muted-foreground col-span-full">No items in this category</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      {dialogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDialogItem(null)} />
          <div className="relative w-full max-w-lg mx-4 rounded-lg border bg-white">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Customize {dialogItem.name}</h3>
            </div>
            <div className="p-4 space-y-4 max-h-[70vh] overflow-auto">
              {(dialogItem.customizations || []).length === 0 ? (
                <p className="text-sm text-gray-600">No customizations available for this item.</p>
              ) : (
                (dialogItem.customizations || []).map(group => (
                  <div key={group.name} className="border rounded-md p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-medium">{group.name}</div>
                      {group.required ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Required</span>
                      ) : (
                        <label className="text-xs inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!enabled[group.name]}
                            onChange={(e) => setOptionalEnabled(group.name, e.target.checked)}
                          />
                          Enable
                        </label>
                      )}
                    </div>
                    {(group.required || enabled[group.name]) && (
                      <div className="space-y-2">
                        {group.options.map(opt => {
                          const checked = selected[group.name] === opt.name
                          return (
                            <label key={opt.name} className="flex items-center gap-2 text-sm">
                              <input type="radio" name={`opt-${group.name}`} checked={checked} onChange={() => chooseOption(group.name, opt.name)} />
                              <span>{opt.name}{opt.price ? ` (+Rs. ${opt.price.toFixed(2)})` : ''}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="p-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogItem(null)}>Cancel</Button>
              <Button onClick={confirmAdd}>Add to Cart</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
