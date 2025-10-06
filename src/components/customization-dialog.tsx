"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export type CustomizationOption = { name: string; price: number };
export type Customization = {
  name: string;
  required: boolean;
  options: CustomizationOption[];
};

export function CustomizationDialog({
  open,
  itemName,
  customizations,
  onClose,
  onConfirm,
}: {
  open: boolean;
  itemName: string;
  customizations?: Customization[];
  onClose: () => void;
  onConfirm: (
    selected: { group: string; options: { name: string; price: number }[] }[]
  ) => void;
}) {
  const [selected, setSelected] = useState<Record<string, string | null>>({});
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    const sel: Record<string, string | null> = {};
    const en: Record<string, boolean> = {};
    (customizations || []).forEach((g) => {
      sel[g.name] = null;
      if (!g.required) en[g.name] = false;
    });
    setSelected(sel);
    setEnabled(en);
  }, [open, customizations]);

  const extraPrice = useMemo(() => {
    if (!customizations) return 0;
    return customizations.reduce((sum, g) => {
      const isEnabled = g.required || enabled[g.name];
      if (!isEnabled) return sum;
      const sel = selected[g.name];
      const opt = g.options.find((o) => o.name === sel);
      return sum + (opt?.price || 0);
    }, 0);
  }, [customizations, selected, enabled]);

  const chooseOption = (group: string, optionName: string) => {
    setSelected((prev) => ({ ...prev, [group]: optionName }));
  };
  const setOptionalEnabled = (group: string, on: boolean) => {
    setEnabled((prev) => ({ ...prev, [group]: on }));
    if (!on) setSelected((prev) => ({ ...prev, [group]: null }));
  };

  const handleConfirm = () => {
    const groups = customizations || [];
    for (const g of groups) {
      if (g.required && !selected[g.name]) {
        alert(`Please select one option for ${g.name}`);
        return;
      }
    }
    const selectedOptions = (customizations || [])
      .map((g) => {
        const selName = selected[g.name];
        const isEnabled = g.required || enabled[g.name];
        if (!isEnabled || !selName) return null;
        const opt = g.options.find((o) => o.name === selName);
        if (!opt) return null;
        return { group: g.name, options: [opt] };
      })
      .filter(Boolean) as {
      group: string;
      options: { name: string; price: number }[];
    }[];
    onConfirm(selectedOptions);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize {itemName}</DialogTitle>
          <DialogDescription>
            Choose options to personalize your order.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-auto pr-1">
          {(customizations || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No customizations available for this item.
            </p>
          ) : (
            (customizations || []).map((group) => (
              <div key={group.name} className="border rounded-md p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-medium">{group.name}</div>
                  {group.required ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      Required
                    </span>
                  ) : (
                    <label className="text-xs inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!enabled[group.name]}
                        onChange={(e) =>
                          setOptionalEnabled(group.name, e.target.checked)
                        }
                      />
                      Enable
                    </label>
                  )}
                </div>
                {(group.required || enabled[group.name]) && (
                  <div className="space-y-2">
                    {group.options.map((opt) => (
                      <label
                        key={opt.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name={`opt-${group.name}`}
                          checked={selected[group.name] === opt.name}
                          onChange={() => chooseOption(group.name, opt.name)}
                        />
                        <span>
                          {opt.name}
                          {opt.price ? ` (+Rs. ${opt.price.toFixed(2)})` : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <div className="mr-auto text-sm text-foreground/70">
            Extra: Rs. {extraPrice.toFixed(2)}
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleConfirm}
            >
              Add to Cart
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
