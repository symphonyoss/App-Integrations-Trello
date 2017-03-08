/**
 * Copyright 2016-2017 Symphony Integrations - Symphony LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.symphonyoss.integration.webhook.trello.parser;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import org.symphonyoss.integration.model.config.IntegrationInstance;

import java.util.Collections;
import java.util.List;

/**
 * This class should be used to skip the incoming requests from Trello when the integration didn't
 * identify which event was received.
 * Created by rsanchez on 08/09/16.
 */
@Component
public class NullTrelloParser implements TrelloParser {

  @Override
  public List<String> getEvents() {
    return Collections.emptyList();
  }

  @Override
  public boolean filterNotifications(IntegrationInstance instance, JsonNode payload) {
    return true;
  }

  @Override
  public String parse(IntegrationInstance instance, JsonNode node)
      throws TrelloParserException {
    return null;
  }

  @Override
  public void setTrelloUser(String trelloUser) {
  }

}
