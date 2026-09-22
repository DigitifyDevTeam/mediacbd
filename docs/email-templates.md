# Templates e-mail MediaCBD

Fichier code : `backend/core/email_templates.py`

Tarifs **uniquement** dans les e-mails (jamais sur le site).

## Règles IA (`AI_RULES`)

- Ne jamais inventer SIRET / IBAN / tarif / adresse
- Pas de garantie trafic / SEO
- Fiche = partenaire, pas recommandation éditoriale
- STOP obligatoire sur la prospection outbound
- Reformulation légère OK, faits nouveaux interdits

## Variables

| Variable | Usage |
|---|---|
| `brand_name` | Enseigne (ex. Origine CBD) |
| `contact_name` | Contact / gérant |
| `email` | Destinataire |
| `address` | Adresse boutique |
| `city` / `postal_code` | Localisation |
| `phone` / `website` / `opening_hours` / `presentation` | Fiche |
| `price_ht` / `price_ttc` | Tarif fiche simple |
| `price_dofollow_ttc` | Fiche + dofollow |
| `price_article_ttc` | Article dédié |
| `currency` | € |
| `invoice_ref` | Réf. facture |
| `payment_method` | ex. virement bancaire |
| `directory_url` / `listing_url` | Liens annuaire / fiche |
| `dofollow_note` | Ex. ` intégré en dofollow` ou vide |
| `media_name` / `media_url` / `commercial_email` | Signature média |
| `editor_footer` | Ligne légale éditeur |
| `missing_fields` | Relance dossier |
| `sender_name` | Ex. L'équipe MediaCBD |

## Templates (parcours Tribune → MediaCBD)

| Clé | Quand |
|---|---|
| `prospect_outreach` | Outbound froid (~30/jour) |
| `ask_billing_pack` | Après intérêt — demande dossier |
| `form_ack` | Après formulaire Acteurs |
| `nudge_missing_fields` | Relance éléments manquants |
| `invoice_sent` | Envoi facture PDF |
| `payment_reminder` | Relance paiement |
| `listing_published` | Fiche en ligne |
| `stop_confirm` | Réponse STOP |
| `rejected_not_fit` | Non éligible |

## Usage Python

```python
from core.email_templates import TEMPLATES, render, build_ai_prompt

ctx = {
    "brand_name": "Origine CBD",
    "address": "17 rue de l'Arsenal, 69004 Lyon",
    "directory_url": "https://mediacbd.fr/acteurs",
    "media_name": "MediaCBD",
    "media_url": "https://mediacbd.fr",
    "commercial_email": "commercial@mediacbd.fr",
    "price_ht": "30",
    "price_ttc": "36",
    "currency": "€",
    "sender_name": "L'équipe MediaCBD",
    "editor_footer": "MediaCBD — [raison sociale] — SIREN [xxx]",
}

subject, body = render(TEMPLATES["prospect_outreach"], ctx)
# ou pour Ollama :
prompt = build_ai_prompt("prospect_outreach", ctx)
```
