-- Numérotation séquentielle atomique des factures/devis.
-- JSHARK-F-{année}-{numéro sur 3 chiffres} ou JSHARK-D-{année}-{numéro sur 3 chiffres}.
-- L'atomicité vient de l'UPSERT sur (annee, type) : deux appels concurrents
-- ne peuvent jamais recevoir le même numéro, y compris après suppression de documents.

create or replace function public.rpc_next_numero(p_type text, p_annee int)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_numero int;
  v_prefixe text;
begin
  if p_type not in ('facture', 'devis') then
    raise exception 'Type de document invalide: %', p_type;
  end if;

  v_prefixe := case p_type when 'facture' then 'F' else 'D' end;

  insert into public.compteurs (annee, type, dernier_numero)
  values (p_annee, p_type, 1)
  on conflict (annee, type)
  do update set dernier_numero = public.compteurs.dernier_numero + 1
  returning dernier_numero into v_numero;

  return format('JSHARK-%s-%s-%s', v_prefixe, p_annee, lpad(v_numero::text, 3, '0'));
end;
$$;

revoke all on function public.rpc_next_numero(text, int) from public;
grant execute on function public.rpc_next_numero(text, int) to authenticated;
